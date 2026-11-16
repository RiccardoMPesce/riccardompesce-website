/**
 * @description Source-backed English topic guide for a historical university syllabus.
 */
export interface CourseSyllabus {
  readonly academicYear: string;
  readonly coverage: "programme" | "objectives-only";
  readonly topics: readonly string[];
}

/**
 * @description English paraphrases of the programme sections in the confirmed UniCT editions,
 * checked on 15 November 2026. Keys are official course codes. Three historical
 * records publish objectives only; their missing programmes are not reconstructed.
 * Original syllabi, including teaching methods, references and assessment where
 * published, remain available through the corresponding official source links.
 */
export const courseSyllabi: Readonly<Record<string, CourseSyllabus>> = {
  "13293": {
    academicYear: "2019/2020",
    coverage: "programme",
    topics: [
      "Software products, quality and lifecycle models: waterfall, incremental, iterative, prototyping, spiral and Unified Process; inception, elaboration and development iterations.",
      "Requirements engineering: functional and quality requirements, elicitation, analysis, documentation and validation; use cases, domain models, system sequence diagrams and operation contracts.",
      "Design strategies: top-down, structured and object-oriented approaches; cohesion, coupling, adaptability, logical architecture and architectural patterns; translating designs into code.",
      "UML modelling: classes, objects, interactions, sequence and collaboration diagrams, activities, state machines, components and deployment; CASE tools and refinement of domain models.",
      "Responsibility assignment with GRASP; reuse through creational, structural and behavioural GoF patterns, supported by design examples.",
      "Verification and validation: static inspection and dynamic testing, test planning, black-box and white-box criteria, equivalence classes, paths, control-flow graphs, cyclomatic complexity, test automation and JUnit.",
      "Configuration management: items, versions, repositories, builds, releases and branches; CVS, SVN and Git. The teaching schedule also introduces middleware evolution, web services and service-oriented architectures.",
    ],
  },
  "13295": {
    academicYear: "2019/2020",
    coverage: "programme",
    topics: [
      "Control-system technology and structural architectures, including analogue-to-digital and digital-to-analogue conversion in controllers.",
      "Sensor and actuator families, operating principles and applications in industrial automation, robotics, vehicles and building automation.",
      "PID regulation: dynamic-performance tuning, closed-loop Ziegler–Nichols tuning, digital implementation and practical deployment issues.",
      "Microcontrollers and control loops: application-dependent behaviour, operating-system timing constraints, input/output delays and sensor–controller–actuator communication latency.",
      "Optimization foundations and linear programming: formulating problems and solving them with linear-programming methods, including the simplex method referenced in the examination examples.",
      "MATLAB exercises applying the theoretical control and optimization material.",
    ],
  },
  "13296": {
    academicYear: "2019/2020",
    coverage: "programme",
    topics: [
      "Security threats, attack classes, availability and risk/economic considerations; cryptographic assumptions, Kerckhoffs’s principle, key spaces, diffusion, confusion and cryptanalysis.",
      "Historical substitution and transposition systems, one-time pads, Vigenère and Enigma; Feistel construction, DES variants and AES, key generation, S-box criteria and differential/linear attacks.",
      "Block-cipher operating modes, stream encryption and RC4; key-distribution mechanisms, Diffie–Hellman, RSA and the ElGamal material listed in the teaching schedule.",
      "Random-number generation, authentication codes, hashes including SHA/MD5 and Whirlpool, digital signatures, certificates, X.509, revocation through OCSP and public-key infrastructures.",
      "Password authentication, salts and one-time passwords; Kerberos and PGP, including trust management and potential attacks.",
      "Firewall classes, network placement and iptables configuration; IPsec architecture, AH/ESP and key management; SSL/TLS, SSH handshakes and authentication.",
      "Email protection with S/MIME and certified email; the schedule additionally references SET. Historical algorithms are syllabus content, not current security recommendations.",
    ],
  },
  "13294": {
    academicYear: "2019/2020",
    coverage: "programme",
    topics: [
      "Information-theoretic foundations and source/channel coding.",
      "Copper, optical-fibre and radio links; transmission media and infrastructure for local-area and wide-area networks.",
      "Design of IP networks supporting integrated and convergent services; enabling technologies for emerging networks and services.",
      "Mobile communication requirements and wireless-channel limitations; shared-channel access, cellular coverage and network-capacity planning.",
      "Mobility procedures: selecting cells, tracking location and performing handovers.",
      "GSM, UMTS and LTE: services, system organization, radio interfaces, mobility and security; evolution towards fifth-generation networks.",
    ],
  },
  "13297": {
    academicYear: "2019/2020",
    coverage: "programme",
    topics: [
      "Industrial real-time requirements, performance measures, time/event-driven models and communication design constraints.",
      "Transmission scheduling with precedence and resource constraints; limitations of FIFO, shortest-job-first and round-robin; timeline, rate-monotonic, deadline-monotonic and earliest-deadline-first scheduling, with schedulability tests.",
      "Industrial data-link addressing and access methods: master/slave, token passing, TDMA and CSMA variants, including collision detection and bitwise arbitration.",
      "Automotive communication domains and technologies: LIN, CAN/CAN FD, FlexRay, MOST, Ethernet Audio Video Bridging and Time-Sensitive Networking.",
      "Fieldbuses including PROFIBUS and HART; IEC 61784 communication profiles; Modbus, POWERLINK, PROFINET and EtherCAT.",
      "Wireless automation: IEEE 802.15.4 real-time support, TSCH, DSME, Bluetooth Low Energy and LoRa; smart factories and Industry 4.0 communication requirements.",
      "Practical work evaluating protocols with OMNeT++ and building wireless sensor-network nodes using supplied hardware.",
    ],
  },
  "13298": {
    academicYear: "2019/2020",
    coverage: "programme",
    topics: [
      "Processor foundations: pipeline organization, implementation hazards and remedies, branch prediction and exception handling.",
      "Memory hierarchies and their implementation; hardware/software approaches to performance improvement.",
      "Instruction-level parallelism: static and dynamic scheduling, speculative hardware execution, multiple instruction issue, superscalar design and VLIW processor families.",
      "Data-level parallelism: vector processing, SIMD extensions, graphics processors and general-purpose GPU computation.",
      "Multiprocessors and thread-level parallelism: architectural classification, topology, communication, shared-memory management and cache-coherence protocols.",
    ],
  },
  "15517": {
    academicYear: "2020/2021",
    coverage: "programme",
    topics: [
      "Language evolution and formal specification/translation; data types, expressions, assignment, control flow, subprogram implementation, memory management, garbage collection, exceptions and event handling.",
      "C++: predefined and user-defined classes, pointers/references, function/operator overloading, runtime objects, extensibility, reuse, arguments/returns, containers, templates, exceptions, the standard library and STL.",
      "Go: syntax, variables, control structures, arrays, slices, maps, functions and defer; pointers, memory, object-oriented techniques, terminal/file I/O, compilation and garbage collection.",
      "Python: collections, strings, advanced functions and objects, standard libraries, development tools, networking, crawling/scraping, serialization, persistence, graphical interfaces and distribution.",
      "R: syntax, arrays, matrices, data frames, functions and packages; vectorization, loops, conditional execution, nonlinear optimization/convergence, input/output and visualization.",
      "C#: types, classes, objects, operations, functional objects, closures, abstraction and inheritance; lambda calculus, lists, pattern matching, events, concurrency and graphical interfaces.",
      "Comparative evaluation of programming paradigms and language facilities, including types, dynamic checking and application-specific language choices.",
    ],
  },
  "15516": {
    academicYear: "2020/2021",
    coverage: "programme",
    topics: [
      "IoT foundations: embedded and cyber-physical systems, smart objects, evolution and design challenges; IoE, Web of Things, machine-to-machine communication and the Tactile Internet.",
      "Applications in health, buildings, energy, mobility, manufacturing, cities and agriculture, supported by case studies.",
      "Sensor/actuator protocol stacks: MQTT, CoAP, LoRaWAN and NB-IoT; smart-object descriptions such as SensorML, virtualization and sensing services.",
      "IoT operating systems including TinyOS, FreeRTOS and Contiki; mobile smart-system applications on Android and iOS.",
      "Cyber-physical modelling: continuous/discrete dynamics, hybrid systems and concurrent computation; sensors, actuators, processors, memory, I/O, multitasking and scheduling.",
      "Formal analysis: invariants, temporal logic, equivalence, refinement, reachability and model checking.",
      "Energy-aware design: performance, power, cost and reliability trade-offs; low-power methods, approximate computation and energy harvesting. Laboratory work accompanies protocols, smart objects, operating systems and formal modelling.",
    ],
  },
  "15519": {
    academicYear: "2020/2021",
    coverage: "programme",
    topics: [
      "Distributed-software paradigms: threads versus virtualization, architecture patterns, components, application servers, multi-tier organization and vertical/horizontal distribution.",
      "Service-oriented architectures, web services, REST and as-a-service models; microservices, Docker containers and Kafka-style messaging; structured DHT and unstructured peer-to-peer networks, CDNs, cloud and fog computing.",
      "Client/server and group communication, multicast/broadcast, message systems, callbacks, event notification and WebSockets.",
      "Interoperability, service quality, scalability, fault tolerance and data consistency as system-design requirements.",
      "Distributed algorithms: synchronous/asynchronous assumptions, Lamport and vector clocks, event ordering, concurrency and global snapshots.",
      "Failure models, including crashes and Byzantine behaviour; dependability, failure detectors, agreement, elections, mutual exclusion and distributed deadlock detection.",
      "Distributed transactions, serializability, recovery and commitment; consistency, replica placement, replication and load sharing; introductory distributed file systems and big-data architectures.",
    ],
  },
  "15518": {
    academicYear: "2020/2021",
    coverage: "programme",
    topics: [
      "Industrial process automation and measurement/control systems; PLC organization and operating principles.",
      "IEC 61131-3 software organization: types, variables, functions, function blocks, programs, resources, tasks and configurations.",
      "Control programming using Ladder Diagram and Sequential Function Chart; application development and classroom exercises with Siemens TIA Portal Step 7.",
      "Communication between control devices using PROFIBUS DP and PROFINET; communication services and distributed fieldbus applications developed with Siemens tools.",
      "Evolution of OPC through COM and XML to OPC UA; information models, sessions, subscriptions, monitored items, services and communication stacks.",
      "OPC UA client/server and publish/subscribe communication; building distributed industrial applications for monitoring, supervision and control.",
    ],
  },
  "15515": {
    academicYear: "2020/2021",
    coverage: "programme",
    topics: [
      "Knowledge-based systems, rational/reactive/autonomous agents and SOAR; deduction, induction, uncertainty and case-based reasoning; Bayesian networks, probabilistic inference, search and optimization.",
      "First-order logic, logic programming and fuzzy reasoning; Semantic Web technologies: RDF, OWL, ontology engineering with Protégé, SPARQL, reasoners and linked data.",
      "Supervised learning with regression, support-vector machines, trees and nearest neighbours; neural models, backpropagation, gradient descent, capacity, over/underfitting and regularization.",
      "Deep-learning practice: tensors, frameworks, augmentation and training; convolutional and recurrent networks, autoencoders, generative adversarial networks and conditional GANs; reinforcement learning and evolutionary computation.",
      "Multimedia processing of audio, video and biosignals; image and text representations, artificial vision, object recognition/detection and semantic segmentation.",
      "Knowledge-discovery workflows: building/testing models, performance metrics, validation/cross-validation, visualization and explainability.",
      "Perception, action, interaction and human–robot communication; autonomous-agent development with the NAO humanoid platform, NAOqi, Choregraphe and the NAO SDK, including extensions to perceptual and cognitive abilities.",
    ],
  },
  "2916": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Number systems: ordered fields, real-number completeness, bounds, density, powers and logarithms; complex numbers in algebraic/trigonometric forms and complex roots.",
      "Functions, composition and inverses; limits, comparison rules, indeterminate forms, infinitesimals, infinities and asymptotes. Sequences, subsequences, notable limits, limsup/liminf and Cauchy convergence.",
      "Continuity and discontinuities; zero existence, extreme-value and intermediate-value results, uniform continuity and Cantor’s theorem.",
      "Differentiation and geometric meaning; derivative rules, higher derivatives, differentials, extrema, Fermat/Rolle/Cauchy/Lagrange theorems, monotonicity, de l’Hôpital, Taylor approximation, convexity and curve analysis.",
      "Numerical series: convergence and remainders, harmonic/geometric examples, comparison/ratio/root/Raabe/condensation tests, absolute and alternating convergence, Leibniz’s criterion, rearrangement and Cauchy products/Mertens’s theorem.",
      "Riemann integration: integrability classes, geometric interpretation, properties and mean-value results; primitives and the fundamental theorem; integration by parts, substitution, rational functions and rationalization; improper integrals, absolute convergence and links with series.",
    ],
  },
  "2922": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Atomic models and the structure of matter.",
      "Chemical bonding and the properties of matter in its different physical states.",
      "Chemical thermodynamics and reaction kinetics.",
      "Chemical equilibrium and electrolyte solutions.",
      "Electrochemical processes.",
      "Introductory organic chemistry. These are the topic groups published in the historical programme; the source does not provide a finer lecture-by-lecture breakdown.",
    ],
  },
  "2919": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Economic rationality and cost–benefit reasoning; individual/market demand, production functions and short/long-run costs; competitive, monopolistic and imperfectly competitive markets.",
      "Macroeconomic aggregates: output, prices/inflation, employment, international payments, public budgets, money, financial markets and interest rates; national-income determination, business cycles and economic policy.",
      "Enterprise foundations: firms, entrepreneurs, legal forms, capital and accounting/non-accounting information systems; balance sheets and income statements.",
      "Engineering investment appraisal: alternatives, project costs, make-or-buy and material choices, financial mathematics, net present value, internal rate of return, payback and other criteria.",
      "Comparing investment alternatives and preparing a business plan.",
    ],
  },
  "2928": {
    academicYear: "2015/2016",
    coverage: "objectives-only",
    topics: [
      "Foundational computer-science concepts and procedural programming.",
      "Principal data structures, elementary algorithms and introductory computational-complexity reasoning.",
      "Application development in ANSI C, emphasizing problem-solving methods and finding programming errors.",
    ],
  },
  "2913": {
    academicYear: "2015/2016",
    coverage: "objectives-only",
    topics: [
      "Solving linear systems and studying linear transformations.",
      "Matrix eigenvalues and diagonalization.",
      "Analytic geometry of lines and planes, planar conics and spatial quadric surfaces.",
    ],
  },
  "2925": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Physical quantities and vectors; scalar/vector kinematics, Newtonian particle dynamics and force laws.",
      "Work, kinetic/potential energy, conservative and dissipative forces; energy balances, central forces and gravitation; relative motion and reference frames.",
      "Particle systems and centres of mass; linear momentum, impulse, angular momentum and conservation principles.",
      "Rigid-body translation/rotation, moments of inertia and the parallel-axis theorem; elastic/inelastic collisions; free, damped and forced harmonic oscillation.",
      "Thermodynamic systems, state variables, equilibrium and equations of state; temperature, heat, work and heat capacities; the first law and ideal/real gases.",
      "Heat engines, refrigerators and Carnot cycles; the second law, reversible/irreversible processes and entropy.",
    ],
  },
  "1681": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Electric charge, conductors/insulators, Millikan’s experiment, Coulomb interaction, fields/potentials, Gauss’s law, capacitance and electric-field energy.",
      "Dielectrics: polarization mechanisms, bound charges, displacement fields, susceptibility and electrostatic equations in materials.",
      "Electromotive force, current, resistance, Ohm/Kirchhoff laws and simple RC/RL circuits.",
      "Magnetic-field sources, forces on currents, Lorentz force, Hall effect, Biot–Savart/Ampère laws, displacement current and solenoids.",
      "Magnetic materials: dia/para/ferromagnetism, hysteresis, Curie laws, microscopic currents, magnetization and field equations in matter.",
      "Faraday/Lenz induction, inductance, transformers, magnetic energy, RLC circuits, phasors and resonance.",
      "Differential Maxwell equations, gradient/divergence/curl, Stokes/divergence theorems and integral/local formulations; LC oscillation and electromagnetic plane-wave propagation.",
      "Light and its spectrum; reflection/refraction, refractive index, total internal reflection, Huygens/Fermat principles, mirrors and thin lenses; diffraction and interference.",
    ],
  },
  "1682": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Operating-system history, classification and structure; the POSIX interface and system calls, using Linux as the principal reference.",
      "Processes, signals, lightweight processes and threads; thread models, POSIX threads and pthread.h programming; CPU scheduling in Linux and real-time systems.",
      "Concurrency, race conditions, critical sections and mutual exclusion; busy-wait solutions, semaphores and mutexes.",
      "Interprocess communication through anonymous pipes, FIFOs, message queues and shared memory; classical synchronization problems.",
      "Deadlock characterization and strategies for detection, prevention and avoidance.",
      "Virtual memory, paging, segmentation and page replacement; Linux memory management; files, directories and file-system implementation.",
      "Hardware/software I/O and interrupts; introductory multiprocessor/distributed systems, client/server designs, iterative/concurrent servers and sockets; Linux and Windows case studies.",
    ],
  },
  "1683": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Sequences and series whose terms are functions.",
      "Differentiation and integration for functions of several variables.",
      "Differential equations and systems of differential equations. The historical programme publishes these three topic groups without a more detailed breakdown.",
    ],
  },
  "1679": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Object-oriented software construction using Java as the main programming language.",
      "Classes and objects; information hiding and encapsulation, polymorphism, inheritance and exception handling, applied in Java programs.",
      "Parametric programming and generics.",
      "Multithreaded and networked application development.",
      "Graphical user-interface programming with Swing.",
    ],
  },
  "1680": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Stationary/quasistationary electromagnetic fields, constitutive relations and Maxwell equations; deriving lumped-circuit models and their validity limits.",
      "Kirchhoff laws; resistors, sources, ideal diodes, capacitors and inductors; energy/power, graph-based node/mesh analysis and duality.",
      "Series/parallel connections, dividers and source transformations; two-port networks, dependent sources, ideal transformers, coupled inductors, reciprocity and interconnections.",
      "Magnetic-circuit analogies and inductance matrices; Tellegen, substitution, superposition, Thévenin, Norton and Millman theorems.",
      "RC/RL and RLC transients: initial conditions, zero-input/zero-state responses and damping; general state equations, natural frequencies, stability and Laplace-domain analysis.",
      "Sinusoidal steady-state analysis with phasors, impedance/admittance, filters, resonance, RMS quantities, maximum-power transfer, Boucherot’s theorem and power-factor correction.",
      "Three-phase circuits with three/four wires, line/phase quantities, balanced systems and equivalent single-phase models; electrical-energy transmission and rotating-machine principles.",
    ],
  },
  "1684": {
    academicYear: "2015/2016",
    coverage: "programme",
    topics: [
      "Systems Theory module: dynamic-system classifications, state variables, block diagrams, state-space models, Laplace transforms/inverses, transfer functions, poles/zeros and continuous/discrete response formulas.",
      "Transition matrices, minimal realizations, Cayley–Hamilton/Jordan methods; motion, trajectories, equilibrium, linearization and phase-plane geometry.",
      "Stability: Lyapunov definitions/equations, eigenvalue tests, BIBO behaviour and Routh’s criterion; reachability, controllability, observability, Kalman forms and stabilizability.",
      "State feedback and eigenvalue placement, Ackermann’s formula, observers, compensation and the separation theorem; harmonic response, Bode diagrams, z-transforms, bilinear transformation, FIR/IIR systems and deadbeat control.",
      "Automatic Control module: first/second-order time/frequency performance, pole-location effects, non-minimum-phase behaviour and polar plots.",
      "Open/closed-loop control, sensitivity and disturbances, steady-state accuracy, Nyquist stability, gain/phase margins and root-locus methods.",
      "Static/dynamic specifications, Nichols charts, lead/lag compensation, frequency/root-locus design; passive/operational-amplifier realizations and empirical/analytical PID tuning.",
      "Discrete control: s/z-plane relations, sampling/reconstruction, Shannon’s theorem and controller design by translation; MATLAB exercises across both modules.",
    ],
  },
  "1678": {
    academicYear: "2015/2016",
    coverage: "objectives-only",
    topics: [
      "Telecommunication principles and preparation for subsequent digital-communication studies.",
      "Representing deterministic and random signals in time and frequency, selecting representations that reveal useful information.",
      "Studying how linear and nonlinear systems transform signals.",
      "Introductory probability as a foundation for random-signal analysis.",
    ],
  },
  "3008": {
    academicYear: "2016/2017",
    coverage: "programme",
    topics: [
      "Combinational design: switching algebra, Boolean minimization, Karnaugh maps and Quine–McCluskey methods.",
      "Synchronous sequential design: memory elements, flip-flops, synthesis and finite-state-machine minimization.",
      "Digital-system workflows separating datapath/control; VHDL entities, architectures, concurrent/sequential models, processes, types, procedures/functions, simulation, synthesis and automated tools.",
      "Computer classes, component organization, technology and performance evaluation, including Amdahl’s law.",
      "Instruction-set architectures and MIPS64 assembly with EduMIPS64; assembling, linking/loading, arithmetic/logic, memory access, system calls, arrays/strings, procedures and stacks.",
      "Sequential processors: datapath and control organization; pipelined execution.",
      "Static/dynamic and synchronous/asynchronous RAM; memory organization, caches, placement/identification/replacement/write policies, performance analysis and cache optimization.",
    ],
  },
  "3007": {
    academicYear: "2016/2017",
    coverage: "programme",
    topics: [
      "Historical development of electronics, from thermionic devices to solid-state technology.",
      "Junction diodes and bipolar/MOS transistors.",
      "Amplifier circuits and systems, including their frequency response.",
      "Introductory power systems and digital circuits. These are the nine published programme headings grouped by theme; the historical source provides no finer device-level topic list.",
    ],
  },
  "3010": {
    academicYear: "2016/2017",
    coverage: "programme",
    topics: [
      "Internet organization, network edges/core, packet-switching delay/loss/throughput, protocol layering, service models and networking history.",
      "Application-layer principles and protocols: HTTP/web, FTP, email and DNS.",
      "Transport services, multiplexing/demultiplexing, UDP, reliable transfer and TCP connection management, flow control and congestion control.",
      "Network-layer services: datagrams versus virtual circuits, routers, IP, IPv4/IPv6 and routing algorithms/protocols.",
      "Link-layer services, error detection/correction, multiple-access protocols, LANs, Ethernet and switching.",
      "Wireless links and network characteristics, IEEE 802.11 Wi-Fi and Bluetooth personal-area networking.",
      "Client-side web development using HTML/HTML5, CSS3 and introductory JavaScript; introduction to server-side web-programming languages.",
    ],
  },
  "3011": {
    academicYear: "2016/2017",
    coverage: "programme",
    topics: [
      "Embedded-technology trends, IoT application scenarios and the progression from ordinary sensors to smart sensors.",
      "Physical interfaces and acquisition: sampling, quantization, encoding, ADC/DAC, I/O interfaces, memory-mapped/programmed I/O, interrupts and direct memory access.",
      "Microcontroller architecture and instruction sets; ports, polling, clocks, timers, converters and interrupt mechanisms; connecting sensors, LCD displays and motors.",
      "Wired communication with UART/USART, SPI, I²C and 1-Wire; open-hardware principles.",
      "Arduino prototyping: serial communication, digital/analogue inputs, reading sensors, visual/audio outputs, remotely controlling devices and using I²C/SPI.",
      "FPGA foundations and Xilinx-based prototyping; embedded CPU, microcontroller, DSP, ASIP and GPU cores; DRAM/SRAM/Flash/EPROM memories and I/O controllers.",
      "Virtualization and IoT operating systems, with practical laboratory activities throughout the hardware/prototyping topics.",
    ],
  },
  "3009": {
    academicYear: "2016/2017",
    coverage: "programme",
    topics: [
      "DBMS foundations, relational data, integrity constraints and keys; SQL definition, manipulation, queries, views, transactions, triggers and procedures; MySQL and MongoDB/NoSQL examples.",
      "Conceptual modelling with entity–relationship diagrams, requirements analysis and quality checks; logical restructuring/relational mapping; physical storage, indexes, hashing and query execution/optimization.",
      "Normalization through Boyce–Codd and third normal forms, including third-normal-form decomposition.",
      "Server-side web foundations: HTML5, CSS, templates and the DOM; Apache–MySQL–PHP applications, forms, sessions/cookies and database access.",
      "Web information-system design with MVC; interaction processes derived from requirements, front-end user experience and organization within an MVC framework.",
      "Client-side JavaScript, form/window/frame manipulation, jQuery, AngularJS, responsive design and AJAX.",
      "Web-application security: SQL/HTML/JavaScript injection, cross-site scripting and denial-of-service/distributed denial-of-service attacks.",
    ],
  },
  "3012": {
    academicYear: "2016/2017",
    coverage: "programme",
    topics: [
      "Digital baseband transmission: PAM architecture, transmit filters, binary/multilevel line codes, coding spectra, spectral efficiency and vector/multidimensional signal representations.",
      "Intersymbol interference and Nyquist criteria; matched filtering, decision regions, MAP/maximum-likelihood detection and bit/symbol error probabilities; modulator/demodulator implementations.",
      "PCM: sampling, quantization and coding; uniform/nonuniform quantizers, companding, quantization noise and signal-to-noise analysis; telephone/audio signal design.",
      "Analogue modulation: passband signals, complex envelopes, spectra, power, amplitude/frequency/phase modulation and disturbance effects.",
      "Binary OOK, BPSK and FSK; multilevel MPSK, QPSK, QAM and FSK; constellations, spectra/bandwidth, efficiency, error-rate comparisons and receiver structures.",
      "Multicarrier communication, DMT/OFDM and MIMO; practical exercises covering signal representations, decisions/errors, pulse shaping, power/energy, PCM and analogue modulation, with MATLAB examples.",
    ],
  },
  "10817": {
    academicYear: "2018/2019",
    coverage: "programme",
    topics: [
      "Large-data processing with MapReduce, Hadoop, Spark and beyond-MapReduce approaches; distributed word counts, matrix/vector operations, joins and grouping.",
      "Frequent-pattern mining: Apriori, PCY, iceberg extensions and candidate-free frequent-set generation.",
      "High-dimensional similarity: shingling, MinHash and locality-sensitive hashing; dimensionality reduction through PCA, SVD, CUR and NNMF, latent semantic indexing and Johnson–Lindenstrauss results.",
      "Recommendation using collaborative filtering, network-based inference and hybrid approaches.",
      "Link analysis with PageRank, spam-resistant analysis and hubs/authorities; online advertising and AdWords algorithms.",
      "Graph/network mining: random-network models, triangle counting, subgraph matching, motifs, overlapping communities, community detection and network alignment.",
      "Text processing with term weighting, bag-of-words representations and entity annotation; connections to dimensionality reduction. Practical activities apply similarity, reduction, recommendation, graph motifs and text mining to large datasets, including citation collections.",
    ],
  },
  "10843": {
    academicYear: "2018/2019",
    coverage: "programme",
    topics: [
      "Probability theory and probability distributions as mathematical foundations for learning algorithms.",
      "Linear modelling for regression problems.",
      "Linear modelling for classification problems.",
      "Neural-network methods and deep-learning approaches.",
      "Python programming and machine-learning libraries. The official Detailed Course Content section publishes these six broad areas without a finer topic breakdown.",
    ],
  },
};
