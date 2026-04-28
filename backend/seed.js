const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Course = require('./models/Course');
const Exercise = require('./models/Exercise');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reseaux_db';

const chapters = [
  {
    id: 'osi-model',
    title: 'Le Modele OSI',
    description: 'Comprendre les 7 couches du modele OSI et leur role dans la communication reseau.',
    order: 1,
    content: 'Le Modele OSI\n\nLe modele OSI est un modele de reference cree par ISO en 1984.\n\nLes 7 Couches:\n\n1. Physique (Layer 1): Transmission de bits bruts. Equipements: cables, hubs. Protocoles: Ethernet, USB.\n\n2. Liaison de Donnees (Layer 2): Acces au medium, detection d erreurs. Equipements: switches, bridges. Protocoles: Ethernet, ARP. Adresse MAC: 48 bits. Trame Ethernet: dest MAC(6) + src MAC(6) + type(2) + donnees + FCS(4).\n\n3. Reseau (Layer 3): Adressage logique et routage. Equipements: routeurs. Protocoles: IP, ICMP, OSPF, BGP.\n\n4. Transport (Layer 4): Communication bout en bout. TCP vs UDP:\nTCP: oriente connexion, fiable, controle de flux, retransmission (ports 80, 443, 22).\nUDP: sans connexion, best-effort, pas de controle (ports 53, 69, 123).\n\n5. Session (Layer 5): Etablissement et maintenance des sessions.\n\n6. Presentation (Layer 6): Syntaxe des donnees. Chiffrement TLS/SSL, compression.\n\n7. Application (Layer 7): Interface utilisateur. Protocoles: HTTP, HTTPS, FTP, SMTP, DNS, DHCP, SSH, SNMP.\n\nEncapsulation: Data -> Segment -> Paquet -> Trame -> Bits.',
    summaryPdfUrl: '#',
    quiz: [
      { question: 'Quel equipement opere au Layer 2 ?', options: ['Routeur', 'Switch', 'Hub', 'Firewall'], correctIndex: 1, explanation: 'Le switch utilise les adresses MAC (Layer 2).' },
      { question: 'Quel protocole Transport est fiable ?', options: ['UDP', 'IP', 'TCP', 'HTTP'], correctIndex: 2, explanation: 'TCP garantit la livraison avec ACK et retransmission.' },
      { question: 'A quelle couche appartient HTTP ?', options: ['Transport', 'Reseau', 'Application', 'Session'], correctIndex: 2, explanation: 'HTTP est un protocole de couche Application (Layer 7).' },
      { question: 'Taille d une adresse MAC ?', options: ['32 bits', '48 bits', '64 bits', '128 bits'], correctIndex: 1, explanation: 'MAC = 48 bits (6 octets) en hexadecimal.' },
      { question: 'Quel protocole resolve IP en MAC ?', options: ['DNS', 'DHCP', 'ARP', 'ICMP'], correctIndex: 2, explanation: 'ARP trouve la MAC correspondant a une IP locale.' }
    ],
    xpReward: 50,
    duration: '45 min'
  },
  {
    id: 'ip-addressing',
    title: 'Adressage IP & Subnetting',
    description: 'Maitriser l adressage IPv4, les masques et le calcul des plages.',
    order: 2,
    content: 'Adressage IP et Subnetting\n\nIPv4 = 32 bits en 4 octets (ex: 192.168.1.1).\nPartie reseau + partie hote.\n\nClasses:\nA: 1.0.0.0-126.255.255.255 /8\nB: 128.0.0.0-191.255.255.255 /16\nC: 192.0.0.0-223.255.255.255 /24\nD: multicast, E: experimental\n\nAdresses speciales:\nNetwork: bits hote a 0. Broadcast: bits hote a 1. Loopback: 127.0.0.0/8.\nPrivees RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.\n\nCIDR:\n/24=255.255.255.0 (254 hotes)\n/26=255.255.255.192 (62 hotes)\n/28=255.255.255.240 (14 hotes)\n/30=255.255.255.252 (2 hotes)\n\nFormules: sous-reseaux=2^n, hotes=2^h-2.\n\nExemple 192.168.1.0/26:\nBloc=64, sous-reseaux: .0, .64, .128, .192\nHotes utilisables: 62\n\nIPv6: 128 bits, notation hex, pas de NAT.',
    summaryPdfUrl: '#',
    quiz: [
      { question: 'Taille IPv4 en bits ?', options: ['16', '32', '64', '128'], correctIndex: 1, explanation: 'IPv4 = 32 bits (4 octets).' },
      { question: 'Hotes utilisables en /28 ?', options: ['14', '16', '30', '62'], correctIndex: 0, explanation: '2^4 - 2 = 14 hotes.' },
      { question: 'Broadcast de 192.168.10.0/24 ?', options: ['.1', '.254', '.255', '.0'], correctIndex: 2, explanation: 'Broadcast = tous bits hote a 1 = .255' },
      { question: 'Masque pour /26 ?', options: ['255.255.255.0', '255.255.255.192', '255.255.255.224', '255.255.255.128'], correctIndex: 1, explanation: '/26 = 255.255.255.192' },
      { question: 'Plage privee RFC 1918 ?', options: ['172.15.0.0/12', '192.169.0.0/16', '10.0.0.0/8', '100.64.0.0/10'], correctIndex: 2, explanation: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16' }
    ],
    xpReward: 50,
    duration: '60 min'
  },
  {
    id: 'tcp-udp',
    title: 'TCP vs UDP & Ports',
    description: 'Comprendre les protocoles de transport et les ports.',
    order: 3,
    content: 'TCP vs UDP\n\nTCP (Transmission Control Protocol):\n- Oriente connexion, fiable\n- Three-way handshake: SYN -> SYN-ACK -> ACK\n- Numeros de sequence, ACK, controle de flux\n- Retransmission en cas de perte\n- En-tete: 20+ octets\n- Flags: SYN, ACK, FIN, RST, PSH, URG\n\nUDP (User Datagram Protocol):\n- Sans connexion, non fiable\n- Rapide et leger (8 octets d en-tete)\n- Pas de handshake, pas de retransmission\n- Usage: streaming, jeux, DNS, VoIP\n\nPorts courants:\n20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP\n53 DNS, 67/68 DHCP, 80 HTTP\n110 POP3, 143 IMAP, 443 HTTPS, 3389 RDP\n\nFermeture TCP (Four-way):\nFIN -> ACK -> FIN -> ACK',
    summaryPdfUrl: '#',
    quiz: [
      { question: 'Flag pour initier connexion ?', options: ['ACK', 'FIN', 'SYN', 'RST'], correctIndex: 2, explanation: 'SYN initie le three-way handshake.' },
      { question: 'Protocole pour streaming video ?', options: ['TCP', 'UDP', 'HTTP', 'FTP'], correctIndex: 1, explanation: 'UDP minimise la latence, tolere pertes.' },
      { question: 'Port par defaut HTTPS ?', options: ['80', '443', '8080', '22'], correctIndex: 1, explanation: 'HTTPS utilise le port 443.' },
      { question: 'Taille en-tete UDP ?', options: ['8', '20', '32', '40'], correctIndex: 0, explanation: 'En-tete UDP = 8 octets.' },
      { question: 'Dernier message du handshake ?', options: ['SYN', 'SYN-ACK', 'ACK', 'FIN'], correctIndex: 2, explanation: 'Le client envoie ACK pour finaliser.' }
    ],
    xpReward: 50,
    duration: '40 min'
  }
];

const exercises = [
  {
    id: 'ex-001',
    title: 'Calcul de sous-reseaux /26',
    topic: 'IP Addressing',
    difficulty: 'Easy',
    problemStatement: 'Reseau 192.168.50.0/24. Diviser en sous-reseaux de 62 hotes max.\n1. Quel masque utiliser ?\n2. Combien de sous-reseaux ?\n3. Premiere adresse du 3e sous-reseau ?\n4. Derniere adresse utilisabe du 2e sous-reseau ?',
    solution: [
      { step: 1, title: 'Determiner le masque', content: '62 hotes => 2^h - 2 >= 62 => h=6. Masque = 32-6 = /26 = 255.255.255.192' },
      { step: 2, title: 'Nombre de sous-reseaux', content: 'Bits empruntes = 26-24 = 2. Nombre de sous-reseaux = 2^2 = 4' },
      { step: 3, title: 'Blocs de sous-reseaux', content: 'Bloc = 256 - 192 = 64. Sous-reseaux: .0, .64, .128, .192' },
      { step: 4, title: '3e sous-reseau', content: 'Premiere adresse du 3e (.128) = 192.168.50.129 (reseau=.128, premiere hote=.129)' },
      { step: 5, title: '2e sous-reseau', content: '2e sous-reseau: .64 a .127. Derniere utilisable = 192.168.50.126 (.127 = broadcast)' }
    ],
    xpReward: 20,
    tags: ['subnetting', 'ipv4']
  },
  {
    id: 'ex-002',
    title: 'Identifier la classe IP',
    topic: 'IP Addressing',
    difficulty: 'Easy',
    problemStatement: 'Donnez la classe de chaque adresse:\n1. 10.5.3.1\n2. 172.20.4.8\n3. 192.168.1.1\n4. 223.45.67.89\n5. 240.10.5.3',
    solution: [
      { step: 1, title: 'Classe A', content: '10.5.3.1 => Classe A (1-126). Privee RFC 1918.' },
      { step: 2, title: 'Classe B', content: '172.20.4.8 => Classe B (128-191). Privee RFC 1918 (172.16-31).' },
      { step: 3, title: 'Classe C', content: '192.168.1.1 => Classe C (192-223). Privee RFC 1918.' },
      { step: 4, title: 'Classe C', content: '223.45.67.89 => Classe C (192-223). Publique.' },
      { step: 5, title: 'Classe E', content: '240.10.5.3 => Classe E (240-255). Reservee experimental.' }
    ],
    xpReward: 20,
    tags: ['classes', 'ipv4']
  },
  {
    id: 'ex-003',
    title: 'OSI Layer Matching',
    topic: 'OSI Model',
    difficulty: 'Easy',
    problemStatement: 'Associez chaque element a sa couche OSI:\n1. Routeur\n2. Switch\n3. HTTP\n4. TCP\n5. Cable Ethernet',
    solution: [
      { step: 1, title: 'Layer 3', content: 'Routeur = Couche Reseau (Layer 3). Routage par adresse IP.' },
      { step: 2, title: 'Layer 2', content: 'Switch = Couche Liaison (Layer 2). Commutation par MAC.' },
      { step: 3, title: 'Layer 7', content: 'HTTP = Couche Application (Layer 7).' },
      { step: 4, title: 'Layer 4', content: 'TCP = Couche Transport (Layer 4).' },
      { step: 5, title: 'Layer 1', content: 'Cable Ethernet = Couche Physique (Layer 1).' }
    ],
    xpReward: 20,
    tags: ['osi', 'layers']
  },
  {
    id: 'ex-004',
    title: 'Ports et Protocoles',
    topic: 'TCP/UDP',
    difficulty: 'Medium',
    problemStatement: 'Associez le port au protocole:\n1. 22\n2. 53\n3. 80\n4. 443\n5. 25',
    solution: [
      { step: 1, title: 'Port 22', content: 'SSH (Secure Shell) - acces distant securise.' },
      { step: 2, title: 'Port 53', content: 'DNS (Domain Name System) - resolution de noms.' },
      { step: 3, title: 'Port 80', content: 'HTTP - web non chiffre.' },
      { step: 4, title: 'Port 443', content: 'HTTPS - web chiffre via TLS/SSL.' },
      { step: 5, title: 'Port 25', content: 'SMTP (Simple Mail Transfer Protocol) - envoi d emails.' }
    ],
    xpReward: 20,
    tags: ['ports', 'protocols']
  },
  {
    id: 'ex-005',
    title: 'Subnetting VLSM',
    topic: 'IP Addressing',
    difficulty: 'Hard',
    problemStatement: 'Reseau 172.16.0.0/16. Creez des sous-reseaux pour:\n- LAN A: 500 hotes\n- LAN B: 200 hotes\n- LAN C: 100 hotes\n- 3 liens WAN: 2 hotes chacun\nDonnez le premier sous-reseau de chaque.',
    solution: [
      { step: 1, title: 'LAN A (500 hotes)', content: '2^h - 2 >= 500 => h=9. /23. 172.16.0.0/23 (0.0-1.255)' },
      { step: 2, title: 'LAN B (200 hotes)', content: '2^h - 2 >= 200 => h=8. /24. 172.16.2.0/24' },
      { step: 3, title: 'LAN C (100 hotes)', content: '2^h - 2 >= 100 => h=7. /25. 172.16.3.0/25 (3.0-3.127)' },
      { step: 4, title: 'WAN 1 (2 hotes)', content: 'h=2. /30. 172.16.3.128/30 (3.128-3.131)' },
      { step: 5, title: 'WAN 2 et 3', content: 'WAN 2: 172.16.3.132/30. WAN 3: 172.16.3.136/30' }
    ],
    xpReward: 30,
    tags: ['vlsm', 'subnetting']
  },
  {
    id: 'ex-006',
    title: 'TCP Handshake Analysis',
    topic: 'TCP/UDP',
    difficulty: 'Medium',
    problemStatement: 'Un client initie une connexion vers un serveur web.\n1. Quel flag le client envoie en premier ?\n2. Quel numero de seq si debut ?\n3. Que repond le serveur ?\n4. Comment le client finalise ?',
    solution: [
      { step: 1, title: 'SYN', content: 'Le client envoie SYN (Synchronize) avec un numero de sequence initial (ISN).' },
      { step: 2, title: 'ISN', content: 'Le numero de sequence initial est aleatoire pour des raisons de securite (ex: Seq=1000).' },
      { step: 3, title: 'SYN-ACK', content: 'Le serveur repond avec SYN-ACK: son propre SYN + ACK du client (Ack=1001).' },
      { step: 4, title: 'ACK final', content: 'Le client envoie ACK (Ack=num serveur + 1). La connexion est etablie.' }
    ],
    xpReward: 20,
    tags: ['tcp', 'handshake']
  },
  {
    id: 'ex-007',
    title: 'Trouver le reseau',
    topic: 'IP Addressing',
    difficulty: 'Medium',
    problemStatement: 'Donnez l adresse reseau et broadcast pour:\n1. 10.45.67.89/8\n2. 172.20.5.6/16\n3. 192.168.10.5/24\n4. 192.168.10.50/26\n5. 10.10.10.10/30',
    solution: [
      { step: 1, title: '/8', content: '10.45.67.89/8 => Reseau: 10.0.0.0, Broadcast: 10.255.255.255' },
      { step: 2, title: '/16', content: '172.20.5.6/16 => Reseau: 172.20.0.0, Broadcast: 172.20.255.255' },
      { step: 3, title: '/24', content: '192.168.10.5/24 => Reseau: 192.168.10.0, Broadcast: 192.168.10.255' },
      { step: 4, title: '/26', content: '192.168.10.50/26 => Bloc=64, 50 dans .0-.63 => Reseau: 192.168.10.0, Broadcast: 192.168.10.63' },
      { step: 5, title: '/30', content: '10.10.10.10/30 => Bloc=4, 10 dans .8-.11 => Reseau: 10.10.10.8, Broadcast: 10.10.10.11' }
    ],
    xpReward: 25,
    tags: ['network', 'broadcast']
  },
  {
    id: 'ex-008',
    title: 'Encapsulation OSI',
    topic: 'OSI Model',
    difficulty: 'Medium',
    problemStatement: 'Decrivez l encapsulation d un message email depuis la couche Application jusqu a la Physique.',
    solution: [
      { step: 1, title: 'Layer 7-6-5', content: 'Application: donnees SMTP. Presentation: chiffrement TLS. Session: etablissement session.' },
      { step: 2, title: 'Layer 4', content: 'Transport: segmentation en segments TCP, ajout ports src/dest, numero seq.' },
      { step: 3, title: 'Layer 3', content: 'Reseau: encapsulation en paquets IP, ajout adresses IP src/dest, TTL.' },
      { step: 4, title: 'Layer 2', content: 'Liaison: encapsulation en trames Ethernet, ajout MAC src/dest, FCS.' },
      { step: 5, title: 'Layer 1', content: 'Physique: conversion en bits, signaux electriques/optiques sur le medium.' }
    ],
    xpReward: 20,
    tags: ['osi', 'encapsulation']
  },
  {
    id: 'ex-009',
    title: 'Plan d adressage',
    topic: 'IP Addressing',
    difficulty: 'Hard',
    problemStatement: 'Entreprise avec 4 departements (Ventes 120, RH 45, IT 30, Direction 10). Reseau 192.168.100.0/24. Creez un plan VLSM optimal.',
    solution: [
      { step: 1, title: 'Ventes (120)', content: '2^h-2>=120 => h=7 => /25. 192.168.100.0/25 (100.0-100.127)' },
      { step: 2, title: 'RH (45)', content: '2^h-2>=45 => h=6 => /26. 192.168.100.128/26 (100.128-100.191)' },
      { step: 3, title: 'IT (30)', content: '2^h-2>=30 => h=5 => /27. 192.168.100.192/27 (100.192-100.223)' },
      { step: 4, title: 'Direction (10)', content: '2^h-2>=10 => h=4 => /28. 192.168.100.224/28 (100.224-100.239)' },
      { step: 5, title: 'Reserve', content: 'Reste: 192.168.100.240/28 et plus pour future expansion.' }
    ],
    xpReward: 30,
    tags: ['vlsm', 'planning']
  },
  {
    id: 'ex-010',
    title: 'DNS Resolution',
    topic: 'TCP/UDP',
    difficulty: 'Medium',
    problemStatement: 'Expliquez le processus de resolution DNS pour www.example.com.',
    solution: [
      { step: 1, title: 'Cache local', content: 'Le client verifie son cache DNS local (navigateur + OS).' },
      { step: 2, title: 'Resolver', content: 'Si cache miss, requete au resolver DNS configure (souvent ISP, ex: 8.8.8.8).' },
      { step: 3, title: 'Root server', content: 'Le resolver interroge un root server (.). Reponse: referal vers TLD .com.' },
      { step: 4, title: 'TLD server', content: 'Interrogation TLD .com. Reponse: referal vers authoritative example.com.' },
      { step: 5, title: 'Authoritative', content: 'Interrogation du NS de example.com. Reponse avec l enregistrement A (IP de www).' }
    ],
    xpReward: 20,
    tags: ['dns', 'protocols']
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Course.deleteMany({});
    await Exercise.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const demoUsers = [
      {
        username: 'admin',
        email: 'admin@reseaux.com',
        passwordHash,
        role: 'admin',
        xp: 500,
        badges: ['OSI Master', 'Subnet Pro'],
        completedChapters: ['osi-model', 'ip-addressing'],
        quizScores: [
          { chapterId: 'osi-model', score: 100, date: new Date() },
          { chapterId: 'ip-addressing', score: 90, date: new Date() }
        ],
        streak: 5,
        lastActiveDate: new Date(),
        exercisesSolved: ['ex-001', 'ex-002', 'ex-003']
      },
      {
        username: 'alice',
        email: 'alice@example.com',
        passwordHash,
        role: 'user',
        xp: 350,
        badges: ['OSI Master'],
        completedChapters: ['osi-model'],
        quizScores: [{ chapterId: 'osi-model', score: 80, date: new Date() }],
        streak: 3,
        lastActiveDate: new Date(),
        exercisesSolved: ['ex-001', 'ex-003']
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        passwordHash,
        role: 'user',
        xp: 200,
        badges: [],
        completedChapters: [],
        quizScores: [],
        streak: 1,
        lastActiveDate: new Date(),
        exercisesSolved: ['ex-001']
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        passwordHash,
        role: 'user',
        xp: 420,
        badges: ['OSI Master', 'Quiz Champion'],
        completedChapters: ['osi-model', 'ip-addressing', 'tcp-udp'],
        quizScores: [
          { chapterId: 'osi-model', score: 100, date: new Date() },
          { chapterId: 'ip-addressing', score: 95, date: new Date() },
          { chapterId: 'tcp-udp', score: 90, date: new Date() }
        ],
        streak: 7,
        lastActiveDate: new Date(),
        exercisesSolved: ['ex-001', 'ex-002', 'ex-003', 'ex-004', 'ex-006']
      },
      {
        username: 'diana',
        email: 'diana@example.com',
        passwordHash,
        role: 'user',
        xp: 280,
        badges: ['Subnet Pro'],
        completedChapters: ['ip-addressing'],
        quizScores: [{ chapterId: 'ip-addressing', score: 85, date: new Date() }],
        streak: 2,
        lastActiveDate: new Date(),
        exercisesSolved: ['ex-001', 'ex-002', 'ex-005']
      }
    ];

    await User.insertMany(demoUsers);
    console.log('Created demo users');

    // Create course
    const course = new Course({
      title: 'Reseaux Informatiques',
      description: 'Cours complet sur les reseaux informatiques',
      chapters
    });
    await course.save();
    console.log('Created course with chapters');

    // Create exercises
    await Exercise.insertMany(exercises);
    console.log('Created exercises');

    console.log('Seed completed successfully!');
    console.log('Login with: admin@reseaux.com / password123 (admin)');
    console.log('Or: alice@example.com / password123 (user)');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

