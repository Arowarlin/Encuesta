// Importar Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where,
  orderBy,
  updateDoc,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class FirebaseService {
  constructor(config) {
    this.app = initializeApp(config);
    this.db = getFirestore(this.app);
  }

  // ==================== PARTICIPANTES ====================
  
  async registrarParticipante(data) {
    try {
      // Verificar si el correo ya existe
      const q = query(
        collection(this.db, 'participantes'), 
        where('correo', '==', data.correo)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        throw new Error('El correo ya está registrado');
      }

      // Generar token único
      const token = this.generarToken();
      
      const docRef = await addDoc(collection(this.db, 'participantes'), {
        ...data,
        token,
        haVotado: false,
        fechaRegistro: serverTimestamp()
      });

      return { id: docRef.id, token };
    } catch (error) {
      throw error;
    }
  }

  async obtenerParticipantes() {
    const q = query(collection(this.db, 'participantes'), orderBy('fechaRegistro', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async obtenerParticipantePorToken(token, correo) {
    const q = query(
      collection(this.db, 'participantes'),
      where('token', '==', token),
      where('correo', '==', correo)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // ==================== CARGOS ====================

  async registrarCargo(data) {
    const docRef = await addDoc(collection(this.db, 'cargos'), {
      ...data,
      fechaCreacion: serverTimestamp()
    });
    return { id: docRef.id };
  }

  async obtenerCargos() {
    const q = query(collection(this.db, 'cargos'), orderBy('fechaCreacion', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // ==================== ASPIRANTES ====================

  async registrarAspirante(data) {
    const docRef = await addDoc(collection(this.db, 'aspirantes'), {
      ...data,
      fechaCreacion: serverTimestamp()
    });
    return { id: docRef.id };
  }

  async obtenerAspirantes() {
    const snapshot = await getDocs(collection(this.db, 'aspirantes'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async obtenerAspirantesPorCargo(cargoId) {
    const q = query(
      collection(this.db, 'aspirantes'),
      where('cargoId', '==', cargoId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // ==================== VOTACIÓN ====================

  async registrarVoto(participanteId, votos) {
    try {
      // Verificar que no haya votado antes
      const participanteRef = doc(this.db, 'participantes', participanteId);
      const participanteDoc = await getDoc(participanteRef);
      
      if (participanteDoc.data().haVotado) {
        throw new Error('Ya has votado anteriormente');
      }

      // Registrar cada voto
      const votosPromises = votos.map(voto => 
        addDoc(collection(this.db, 'votos'), {
          participanteId,
          cargoId: voto.cargoId,
          aspiranteId: voto.aspiranteId || null,
          tipoVoto: voto.tipoVoto,
          fechaVoto: serverTimestamp()
        })
      );

      await Promise.all(votosPromises);

      // Marcar participante como votado
      await updateDoc(participanteRef, { haVotado: true });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async obtenerResultados() {
    const [votosSnapshot, cargosSnapshot, aspirantesSnapshot, participantesSnapshot] = await Promise.all([
      getDocs(collection(this.db, 'votos')),
      getDocs(collection(this.db, 'cargos')),
      getDocs(collection(this.db, 'aspirantes')),
      getDocs(collection(this.db, 'participantes'))
    ]);

    const votos = votosSnapshot.docs.map(doc => doc.data());
    const cargos = cargosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const aspirantes = aspirantesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const participantes = participantesSnapshot.docs.map(doc => doc.data());

    // Procesar resultados
    const resultados = {};
    
    cargos.forEach(cargo => {
      resultados[cargo.id] = {
        cargo: cargo.nombre,
        aspirantes: {},
        noSe: 0,
        ninguno: 0,
        total: 0
      };

      // Inicializar contadores de aspirantes
      aspirantes
        .filter(a => a.cargoId === cargo.id)
        .forEach(a => {
          resultados[cargo.id].aspirantes[a.id] = {
            nombre: a.nombre,
            votos: 0
          };
        });
    });

    // Contar votos
    votos.forEach(voto => {
      if (!resultados[voto.cargoId]) return;

      resultados[voto.cargoId].total++;

      if (voto.tipoVoto === 'aspirante' && voto.aspiranteId) {
        if (resultados[voto.cargoId].aspirantes[voto.aspiranteId]) {
          resultados[voto.cargoId].aspirantes[voto.aspiranteId].votos++;
        }
      } else if (voto.tipoVoto === 'no_se') {
        resultados[voto.cargoId].noSe++;
      } else if (voto.tipoVoto === 'ninguno') {
        resultados[voto.cargoId].ninguno++;
      }
    });

    return {
      resultados,
      estadisticas: {
        totalParticipantes: participantes.length,
        totalVotantes: participantes.filter(p => p.haVotado).length,
        totalCargos: cargos.length,
        porcentajeParticipacion: participantes.length > 0 
          ? ((participantes.filter(p => p.haVotado).length / participantes.length) * 100).toFixed(2)
          : 0
      }
    };
  }

  // ==================== UTILIDADES ====================

  generarToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async obtenerEstadisticas() {
    const [participantesSnapshot, cargosSnapshot, votosSnapshot] = await Promise.all([
      getDocs(collection(this.db, 'participantes')),
      getDocs(collection(this.db, 'cargos')),
      getDocs(collection(this.db, 'votos'))
    ]);

    const participantes = participantesSnapshot.docs.map(doc => doc.data());
    const votantes = participantes.filter(p => p.haVotado).length;

    return {
      totalParticipantes: participantes.length,
      totalVotantes: votantes,
      totalCargos: cargosSnapshot.size,
      porcentajeParticipacion: participantes.length > 0 
        ? ((votantes / participantes.length) * 100).toFixed(2)
        : 0
    };
  }
}

// Crear instancia global
let firebaseService = null;

function initFirebase(config) {
  if (!firebaseService) {
    firebaseService = new FirebaseService(config);
  }
  return firebaseService;
}

export { initFirebase, firebaseService };