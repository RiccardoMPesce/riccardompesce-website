type Course = {
  readonly name: string;
  readonly language: "en";
  readonly credits: number;
  readonly year: 1 | 2 | 3;
  readonly description: string;
  readonly syllabus: {
    readonly url: string;
    readonly academicYear: string;
  } | null;
};

type Education = {
  readonly degree: string;
  readonly year: string;
  readonly result?: string;
  readonly institution: string;
  readonly credits: number;
  readonly coursework: readonly Course[];
  readonly thesis: {
    readonly label: "Bachelor’s thesis" | "Master’s thesis";
    readonly title: string | null;
    readonly sections: readonly {
      readonly heading: "Rationale" | "Objective" | "Experiment" | "Results";
      readonly paragraphs: readonly string[];
    }[];
    readonly credits: number;
    readonly year: 1 | 2 | 3;
  };
};

/**
 * @description Public academic activities and credits from the two author-supplied
 * degree transcripts. Descriptions summarize the referenced historical UniCT syllabi,
 * reviewed on 11 November 2026; editions are references, not proof of attendance
 * in a specific year or teaching channel. The master elective description follows
 * the author's clarification that professional experience at Oney was recognized.
 * The bachelor additional activity follows the author's account of a theoretical
 * ML pipeline discussion connected to their Appen evaluator work.
 * The master additional activity follows the supplied AXLE course flyer.
 * Thesis summaries follow the supplied bachelor thesis DOCX and master thesis
 * presentation PDF; results describe those experiments, not general guarantees.
 */
export const education = [
  {
    degree: "M.Sc. in Computer Engineering · LM-32",
    year: "2023",
    result: "110/110 with honours",
    institution: "University of Catania, Italy",
    credits: 120,
    thesis: {
      label: "Master’s thesis",
      title: "Deep Learning for Rest State Classification Using EEG/fMRI Data",
      sections: [
        {
          heading: "Rationale",
          paragraphs: [
            "EEG and fMRI provide two recorded views of brain activity. The thesis examined how deep-learning models could learn from each modality and combine their representations to classify resting-state observations.",
          ],
        },
        {
          heading: "Objective",
          paragraphs: [
            "Compare EEG-only, fMRI-only and multimodal classification on paired recordings, and assess whether combining their feature embeddings improved the results. The analysis also examined how carbon-wire-loop (CWL) channels and alpha-frequency filtering affected EEG performance.",
          ],
        },
        {
          heading: "Experiment",
          paragraphs: [
            "Used the CWL EEG/fMRI dataset, pairing EEG sequences with the corresponding fMRI frames. EEG models included a five-layer 1-D convolutional baseline and the 2-D EEGNet architecture. The baseline was evaluated with and without CWL artifact-monitoring channels; EEGNet was also evaluated using only alpha frequencies (8–12 Hz).",
            "A 3-D CNN processed individual fMRI frames. Feature vectors from the EEG and fMRI networks were concatenated and fed to a multilayer perceptron for multimodal classification. The presentation compared training, validation and test accuracy, reporting test performance at the checkpoint with the highest validation accuracy.",
          ],
        },
        {
          heading: "Results",
          paragraphs: [
            "The summary tables report 80.36% test accuracy for EEGNet and 67.41% for its alpha-filtered variant. The 1-D baseline without CWL channels reached 50.00%. The fMRI model reached 51.04%, and the multimodal model 47.92%; combining modalities did not improve classification in these experiments.",
            "Sensitivity to CWL channels was a central interpretation issue, while the single-frame fMRI model did not provide a useful basis for feature fusion. The conclusions emphasized understanding and preprocessing the recordings, validating each modality, and exploring other architectures or complete fMRI sequences as future work. This account is based on the thesis presentation, not an independently replicated evaluation.",
          ],
        },
      ],
      credits: 18,
      year: 2,
    },
    coursework: [
      {
        name: "Software Engineering",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Software development processes, requirements analysis, architecture and design. UML modelling, architectural and design patterns, verification, validation and testing connect the stages of the software lifecycle.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=13293",
          academicYear: "2019/2020",
        },
      },
      {
        name: "Control Systems Technology",
        language: "en",
        credits: 6,
        year: 1,
        description:
          "Control-system architectures, sensors, actuators and analogue/digital conversion. PID tuning and digital implementation, microcontrollers, timing constraints in control loops and introductory linear optimization, with MATLAB exercises.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=13295",
          academicYear: "2019/2020",
        },
      },
      {
        name: "Information Systems Security",
        language: "en",
        credits: 6,
        year: 1,
        description:
          "Theoretical and applied network security: cryptography, encryption methods, security protocols and secure application design. Authentication, confidentiality and the configuration of network security services.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=13296",
          academicYear: "2019/2020",
        },
      },
      {
        name: "Telecommunication Systems Architectures and Technologies",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Information theory, coding, transmission media and IP network design for convergent services. Fixed and mobile networks, radio access, mobility management, GSM, UMTS, LTE and the evolution towards 5G.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=13294",
          academicYear: "2019/2020",
        },
      },
      {
        name: "Industrial Automation Networks",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Real-time communication and schedulability in industrial and automotive systems. CAN, LIN, fieldbuses, Industrial Ethernet, PROFINET, EtherCAT and TSN; wireless automation networks and protocol evaluation with OMNeT++.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=13297",
          academicYear: "2019/2020",
        },
      },
      {
        name: "Advanced Computer Architectures",
        language: "en",
        credits: 6,
        year: 1,
        description:
          "Processor pipelines, branch prediction, memory hierarchies and performance analysis. Instruction-level, data-level and thread-level parallelism, superscalar and VLIW architectures, SIMD/GPGPU and cache coherence in multiprocessors.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=13298",
          academicYear: "2019/2020",
        },
      },
      {
        name: "Additional Skills for Employment",
        language: "en",
        credits: 3,
        year: 1,
        description:
          "Project Life Cycle course offered by AXLE ICT Solutions: 30 hours, delivered in English. Covered the entire project lifecycle from initial setup through project completion and maintenance, combining technical tools with behavioural strategies, personal soft skills and communication techniques.",
        syllabus: null,
      },
      {
        name: "Elective · Recognized Professional Experience",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Recognition of my professional experience at Oney Insurance, complemented by data science, software development, machine learning and analytics.",
        syllabus: null,
      },
      {
        name: "Advanced Programming Languages",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "Language design and formal languages, type systems, memory management, exceptions and programming paradigms. Comparative study of C++, Go, Python, R and C#, including object-oriented, functional and concurrent programming.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=15517",
          academicYear: "2020/2021",
        },
      },
      {
        name: "Internet of Things Based Smart Systems",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "Cyber-physical and embedded systems, smart sensors and IoT applications. MQTT, CoAP, LoRa and NB-IoT, IoT operating systems, modelling and verification, energy-efficient design and energy harvesting.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=15516",
          academicYear: "2020/2021",
        },
      },
      {
        name: "Distributed Systems and Big Data",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "Distributed architectures, services, containers, messaging and cloud/fog computing. Logical clocks, coordination, fault tolerance, agreement, distributed transactions, consistency and replication, with an introduction to big-data architectures.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=15519",
          academicYear: "2020/2021",
        },
      },
      {
        name: "Industrial Informatics",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "PLC architectures and IEC 61131-3 programming, including Ladder Diagram and Sequential Function Chart. Siemens TIA Portal exercises, distributed control over PROFIBUS/PROFINET and OPC UA information models, services and publish/subscribe communication.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=15518",
          academicYear: "2020/2021",
        },
      },
      {
        name: "Cognitive Computing and Artificial Intelligence",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "Intelligent systems combining machine learning, multimedia analysis, knowledge representation, logic and automated reasoning. Supervised and unsupervised learning, pattern recognition, autonomous agents and practical work with deep-learning and semantic-web tools.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/lm-32/insegnamenti/?cod=15515",
          academicYear: "2020/2021",
        },
      },
    ],
  },
  {
    degree: "B.Sc. in Computer Engineering · L-8",
    year: "2019",
    institution: "University of Catania, Italy",
    credits: 180,
    thesis: {
      label: "Bachelor’s thesis",
      title: "Domain Adaptation through Regression",
      sections: [
        {
          heading: "Rationale",
          paragraphs: [
            "Pretrained image classifiers offer reusable features, but different convolutional architectures produce different feature representations. The thesis explored whether regression could map one network’s embeddings into another network’s feature space so that a classifier already adapted to a target task could be reused.",
          ],
        },
        {
          heading: "Objective",
          paragraphs: [
            "Classify images of ants and bees while comparing regression-based adaptation with individual training on the target task. The goal was to examine both classification accuracy and measured training time across different source–reference network pairs.",
          ],
        },
        {
          heading: "Experiment",
          paragraphs: [
            "Used ImageNet-pretrained Inception v3, ResNet18 and DenseNet121 models in Python with PyTorch. Images were resized and normalized before extracting the feature embeddings preceding the classification layer. For each network pair, the same image was processed by both networks, with one network adapted to the target task serving as the reference.",
            "A scikit-learn Ridge regressor mapped the source embeddings to the reference feature space before classification. All six directed pairings were compared with the individually trained networks. The runs were performed on CPU. Individual CNN training used 25 epochs, stochastic gradient descent, a batch size of four, a learning rate of 0.1 and momentum of 0.9.",
          ],
        },
        {
          heading: "Results",
          paragraphs: [
            "ResNet18 adapted to DenseNet121 and DenseNet121 adapted to ResNet18 both reached 95% accuracy, with reported training times of 3 minutes 33 seconds and 3 minutes 38 seconds. Individual training reached 96% for ResNet18 in 12 minutes 43 seconds and 95% for DenseNet121 in 14 minutes 52 seconds.",
            "Pairings involving Inception reached 61–74% accuracy, below its individually trained result of 96%. The results therefore varied with the network pairing. Evaluation used a small two-class dataset and its validation partition to assess adaptation; these measurements describe that setup and do not establish the same accuracy or time savings on other datasets.",
          ],
        },
      ],
      credits: 3,
      year: 3,
    },
    coursework: [
      {
        name: "Mathematical Analysis I",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Real and complex numbers, limits and continuity, differential calculus for functions of one variable, numerical series and Riemann integration. Mathematical tools for analysing functions and solving quantitative problems.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=2916",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Chemistry",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Atomic structure, chemical bonding, states of matter and the behaviour of common materials. Chemical thermodynamics, kinetics, equilibria, electrolyte solutions, electrochemistry and introductory organic chemistry.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=2922",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Engineering Economics",
        language: "en",
        credits: 6,
        year: 1,
        description:
          "Economic reasoning for engineering decisions: costs and benefits, markets, production and business organization. Financial statements, project investment analysis and the economic evaluation of engineering alternatives.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=2919",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Computer Science Fundamentals",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Computer science and procedural programming fundamentals. Core data structures, basic algorithms, introductory computational complexity and application development in ANSI C, with an emphasis on problem solving and debugging.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=2928",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Linear Algebra and Geometry",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Linear systems and linear maps, matrix eigenvalues and diagonalization. Linear geometry of lines and planes, conic sections and quadric surfaces.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=2913",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Physics I",
        language: "en",
        credits: 9,
        year: 1,
        description:
          "Mechanics and thermodynamics: motion, Newton’s laws, work, energy and conservation principles. Particle systems, rigid-body dynamics and oscillations connect mathematical models with physical problems.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=2925",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Foreign Language Proficiency Assessment",
        language: "en",
        credits: 3,
        year: 1,
        description:
          "Foreign-language proficiency assessment recorded as a 3-credit activity. The transcript does not identify the language, proficiency level or a separate syllabus for this assessment.",
        syllabus: null,
      },
      {
        name: "Physics II",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "Electromagnetism and optics: electric and magnetic fields, electromagnetic induction, Maxwell’s equations and wave propagation. Geometrical and physical optics include reflection, refraction, interference and diffraction.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=1681",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Operating Systems",
        language: "en",
        credits: 6,
        year: 2,
        description:
          "Operating-system design and resource management, using Linux as a principal reference. Processes, threads, CPU scheduling, synchronization, IPC, deadlocks, virtual memory, file systems, I/O and POSIX programming.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=1682",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Mathematical Analysis II",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "Sequences and series of functions, differential and integral calculus in several variables, and differential equations and systems. Methods for understanding and constructing mathematical models in engineering.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=1683",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Object-Oriented Programming",
        language: "en",
        credits: 6,
        year: 2,
        description:
          "Object-oriented programming in Java: classes, encapsulation, inheritance, polymorphism and exception handling. Generics, multithreading, network programming and graphical interfaces with Swing.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=1679",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Electrical Engineering",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "Circuit models, Kirchhoff’s laws, network theorems and systematic analysis methods. Transient and sinusoidal responses, phasors, Laplace methods, coupled circuits and introductory three-phase and power applications.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=1680",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Automatic Control",
        language: "en",
        credits: 12,
        year: 2,
        description:
          "The integrated course covers Systems Theory and Automatic Control: dynamic models, state-space and transfer functions, stability, controllability and observability. Feedback design, compensation, frequency-response methods and digital control are supported by MATLAB exercises.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=1684",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Signal Theory",
        language: "en",
        credits: 9,
        year: 2,
        description:
          "Representation of deterministic and random signals in time and frequency. Signal transformations through linear and nonlinear systems, with probability foundations for random-signal analysis and telecommunications.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=1678",
          academicYear: "2015/2016",
        },
      },
      {
        name: "Computer Architecture",
        language: "en",
        credits: 9,
        year: 3,
        description:
          "Combinational and sequential logic, finite-state machines and hardware design with VHDL. Computer organization, MIPS64 assembly, datapaths, control units, pipelines, memory hierarchies and cache performance.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=3008",
          academicYear: "2016/2017",
        },
      },
      {
        name: "Electronics",
        language: "en",
        credits: 9,
        year: 3,
        description:
          "Electronic devices and their use in analogue and digital circuits. Diodes, bipolar and MOS transistors, amplifiers, frequency response, digital circuits and analogue-to-digital conversion.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=3007",
          academicYear: "2016/2017",
        },
      },
      {
        name: "Internet Architecture and Web Programming",
        language: "en",
        credits: 9,
        year: 3,
        description:
          "Internet architecture and computer networks: application protocols, TCP/UDP, IP addressing, subnetting, routing and wired/wireless link technologies. Web-oriented programming connects network services with application development.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=3010",
          academicYear: "2016/2017",
        },
      },
      {
        name: "Additional Skills for Employment",
        language: "en",
        credits: 3,
        year: 3,
        description:
          "Theoretical discussion of an end-to-end machine learning data pipeline, connected to my work evaluating advertisement relevance and Business Page descriptions for Appen. Considered how a hypothetical pipeline could extract content and evaluator judgments, transform them through cleaning, normalization, deduplication and label-quality checks, and load raw data, curated datasets and annotation metadata into separate storage layers. Discussed dataset versioning, train/validation/test separation, feature preparation, and how human assessments could support training and evaluating classification or ranking models. The architecture is illustrative; it does not describe Appen’s internal platform.",
        syllabus: null,
      },
      {
        name: "Fixed and Mobile Systems Architecture Laboratory",
        language: "en",
        credits: 6,
        year: 3,
        description:
          "Microcontroller programming and hardware/software prototyping with Arduino. Sensors and physical interfaces, I/O, communication buses, IoT operating systems and introductory FPGA implementation.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=3011",
          academicYear: "2016/2017",
        },
      },
      {
        name: "Databases and Information Systems",
        language: "en",
        credits: 9,
        year: 3,
        description:
          "Relational data modelling, SQL, transactions, normalization, indexing and query optimization, alongside NoSQL concepts. Database-backed web information systems, MVC, client/server programming and web-application security.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=3009",
          academicYear: "2016/2017",
        },
      },
      {
        name: "Electrical Communications",
        language: "en",
        credits: 6,
        year: 3,
        description:
          "Digital baseband transmission, line coding, intersymbol interference and error rates. Sampling, quantization and PCM, analogue modulation, digital modulation schemes, MIMO and OFDM.",
        syllabus: {
          url: "https://www.dieei.unict.it/corsi/l-8-inf/insegnamenti/?cod=3012",
          academicYear: "2016/2017",
        },
      },
      {
        name: "Big Data",
        language: "en",
        credits: 6,
        year: 3,
        description:
          "Mining large datasets using MapReduce and Hadoop, frequent-itemset algorithms and similarity search. Recommendation systems, dimensionality reduction, PageRank, graph/network analysis and text mining.",
        syllabus: {
          url: "https://web.dmi.unict.it/corsi/lm-18/insegnamenti?cod=10817",
          academicYear: "2018/2019",
        },
      },
      {
        name: "Machine Learning",
        language: "en",
        credits: 6,
        year: 3,
        description:
          "Probability foundations, linear models for regression and classification, neural networks and deep learning. Algorithm design, optimization, model evaluation and prototyping with Python libraries.",
        syllabus: {
          url: "https://web.dmi.unict.it/courses/lm-18/course-units/?cod=10843",
          academicYear: "2018/2019",
        },
      },
    ],
  },
] as const satisfies readonly Education[];
