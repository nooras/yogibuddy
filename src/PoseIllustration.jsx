const figures = {
  mountain: {
    head: [120, 24],
    lines: ["M120 42V89", "M120 51L99 67L91 87", "M120 51L141 67L149 87", "M120 89L105 118L105 151", "M120 89L135 118L135 151"],
  },
  tree: {
    head: [120, 24],
    lines: ["M120 42V89", "M120 51L101 67L91 84", "M120 51L140 67L148 83", "M120 89L107 119L107 151", "M120 89L137 107L119 91L135 151"],
  },
  triangle: {
    head: [125, 34],
    lines: ["M123 51L112 91", "M123 56L91 67L66 78", "M123 56L145 41L160 23", "M112 91L78 112L43 139", "M112 91L147 112L187 139"],
  },
  standingFold: {
    head: [111, 75],
    lines: ["M118 87L130 105L145 115", "M123 96L101 111L82 129", "M123 96L144 105L164 119", "M145 115L133 133L126 151", "M145 115L163 132L174 151"],
  },
  warrior1: {
    head: [120, 24],
    lines: ["M120 42V82", "M120 51L102 32L98 14", "M120 51L138 32L142 14", "M120 82L104 109L90 137L52 145", "M120 82L137 105L155 127L191 135"],
  },
  warrior2: {
    head: [120, 30],
    lines: ["M120 48V86", "M120 53L92 54L61 54", "M120 53L149 54L180 54", "M120 86L101 108L91 136L54 145", "M120 86L142 106L152 126L191 134"],
  },
  warrior3: {
    head: [120, 44],
    lines: ["M137 58L102 80L75 101", "M132 61L108 39L87 19", "M132 61L118 35L105 16", "M102 80L111 111L119 144", "M102 80L72 75L42 69"],
  },
  chair: {
    head: [120, 24],
    lines: ["M120 42L119 83", "M120 51L102 34L101 16", "M120 51L138 34L139 16", "M119 83L100 102L91 126L101 148", "M119 83L137 102L149 125L139 148"],
  },
  sideAngle: {
    head: [133, 33],
    lines: ["M128 49L112 86", "M128 53L97 64L73 75", "M128 53L150 35L165 16", "M112 86L78 105L43 137", "M112 86L145 105L182 137"],
  },
  halfMoon: {
    head: [120, 42],
    lines: ["M135 56L106 78L83 96", "M130 58L105 35L83 19", "M130 58L152 34L173 20", "M106 78L81 105L53 133", "M106 78L133 76L159 70"],
  },
  easySeat: {
    head: [120, 25],
    lines: ["M120 43V83", "M120 53L100 68L91 83", "M120 53L140 68L149 83", "M120 83L98 105L72 111L101 124", "M120 83L142 105L168 111L139 124"],
  },
  staff: {
    head: [120, 25],
    lines: ["M120 43V83", "M120 53L99 67L91 87", "M120 53L141 67L149 87", "M120 83L92 100L58 100", "M120 83L148 100L182 100"],
  },
  forwardSeat: {
    head: [83, 83],
    lines: ["M99 91L127 99", "M110 94L95 105L82 112", "M110 94L129 103L148 111", "M127 99L103 111L74 119", "M127 99L153 110L184 119"],
  },
  twist: {
    head: [120, 25],
    lines: ["M120 43L126 81", "M120 52L105 65L91 78", "M120 52L143 64L153 77", "M126 81L99 103L72 112L100 123", "M126 81L146 102L172 110L144 122"],
  },
  boundAngle: {
    head: [120, 25],
    lines: ["M120 43V83", "M120 53L99 68L91 86", "M120 53L141 68L149 86", "M120 83L101 101L82 117L120 127", "M120 83L139 101L158 117L120 127"],
  },
  childPose: {
    head: [76, 102],
    lines: ["M89 105L120 111L144 116", "M104 109L89 123L70 130", "M104 109L119 122L137 127", "M120 111L139 127L164 137", "M120 111L140 119L169 120"],
  },
  dog: {
    head: [75, 90],
    lines: ["M88 94L113 97L139 90", "M103 96L93 116L82 137", "M103 96L117 116L125 139", "M139 90L158 108L174 126", "M139 90L154 67L170 45"],
  },
  corpse: {
    head: [42, 94],
    lines: ["M57 94H120", "M77 94L73 77L68 67", "M77 94L73 111L68 121", "M120 94L151 91L183 89", "M120 94L151 98L183 100"],
  },
  cobra: {
    head: [120, 50],
    lines: ["M120 66L120 100L143 111", "M120 80L97 92L76 106", "M120 80L142 91L160 105", "M143 111L166 116L188 116", "M143 111L166 122L189 124"],
  },
  bow: {
    head: [120, 55],
    lines: ["M120 70L120 99L149 111", "M120 79L99 92L81 104", "M120 79L140 91L156 104", "M149 111L139 83L124 61L143 54", "M149 111L101 83L116 61L97 54"],
  },
  bridge: {
    head: [42, 113],
    lines: ["M57 113L91 106L120 81", "M75 110L67 93L61 85", "M75 110L66 127L60 136", "M120 81L151 103L174 111", "M120 81L148 82L169 87"],
  },
  locust: {
    head: [48, 110],
    lines: ["M63 110L102 111L132 107", "M82 110L72 94L67 85", "M82 110L73 125L68 135", "M132 107L160 94L188 83", "M132 107L159 115L188 124"],
  },
  camel: {
    head: [120, 38],
    lines: ["M120 55L120 97", "M120 64L98 51L80 39", "M120 64L142 51L160 39", "M120 97L102 115L97 140L79 146", "M120 97L138 115L143 140L161 146"],
  },
  wheel: {
    head: [120, 54],
    lines: ["M120 70L119 96L145 111", "M120 76L97 84L82 97", "M120 76L143 84L158 97", "M145 111L163 83L177 60L193 55", "M145 111L98 83L82 60L66 55"],
  },
  bowStanding: {
    head: [125, 34],
    lines: ["M120 51L109 87", "M117 59L96 76L83 95", "M117 59L141 48L154 37", "M109 87L99 118L95 149", "M109 87L136 103L156 84L151 59"],
  },
  dancer: {
    head: [120, 24],
    lines: ["M120 42L120 82", "M120 52L99 67L91 84", "M120 52L141 67L149 84", "M120 82L106 114L99 148", "M120 82L141 99L151 75L141 55"],
  },
  eagle: {
    head: [120, 25],
    lines: ["M120 43V82", "M120 52L108 36L122 31L135 43", "M120 52L132 36L118 31L105 43", "M120 82L108 109L123 120L108 132L108 151", "M120 82L136 107L122 119L136 132L136 151"],
  },
  crow: {
    head: [164, 68],
    lines: ["M149 75L121 90L104 109", "M138 81L124 65L111 54", "M138 81L132 61L120 48", "M104 109L84 104L73 116", "M104 109L91 124L78 132"],
  },
  shoulderStand: {
    head: [120, 145],
    lines: ["M120 130L120 93L121 67", "M120 118L98 126L81 136", "M120 118L142 126L159 136", "M121 67L109 43L99 20", "M121 67L133 43L143 20"],
  },
  headstand: {
    head: [120, 134],
    lines: ["M120 119V82L120 53", "M120 108L94 121L83 140", "M120 108L146 121L157 140", "M120 53L107 34L101 17", "M120 53L133 34L139 17"],
  },
  legsWall: {
    head: [54, 129],
    lines: ["M68 129H119", "M81 129L80 112L78 101", "M81 129L80 146L78 155", "M119 129L132 96L144 62L154 30", "M119 129L123 96L126 62L130 30"],
  },
  flow: {
    head: [120, 24],
    lines: ["M120 42V89", "M120 51L99 67L91 87", "M120 51L141 67L149 87", "M120 89L105 118L105 151", "M120 89L135 118L135 151"],
  },
};

function figureFor(name, category) {
  const value = name.toLowerCase();
  if (value.includes("tree")) return figures.tree;
  if (value.includes("triangle") || value.includes("trikonasana")) return figures.triangle;
  if (/warrior iii\b|virabhadrasana iii\b/.test(value)) return figures.warrior3;
  if (/warrior ii\b|virabhadrasana ii\b/.test(value)) return figures.warrior2;
  if (/warrior i\b|virabhadrasana i\b/.test(value)) return figures.warrior1;
  if (value.includes("chair pose") || value.includes("utkatasana")) return figures.chair;
  if (value.includes("side angle") || value.includes("parsvakonasana")) return figures.sideAngle;
  if (value.includes("half moon") || value.includes("ardha chandrasana")) return figures.halfMoon;
  if (value.includes("mountain") || value.includes("tadasana")) return figures.mountain;
  if (value.includes("vrikshasana")) return figures.tree;
  if (value.includes("eagle")) return figures.eagle;
  if (value.includes("dancer") || value.includes("nataraja")) return figures.dancer;
  if (value.includes("crow") || value.includes("bakasana")) return figures.crow;
  if (value.includes("child")) return figures.childPose;
  if (value.includes("downward") || value.includes("adho mukha")) return figures.dog;
  if (value.includes("cobra") || value.includes("bhujangasana")) return figures.cobra;
  if (value.includes("bow pose") || value.includes("dhanurasana")) return figures.bow;
  if (value.includes("bridge") || value.includes("setu bandhasana")) return figures.bridge;
  if (value.includes("locust") || value.includes("salabhasana")) return figures.locust;
  if (value.includes("camel") || value.includes("ustrasana")) return figures.camel;
  if (value.includes("wheel") || value.includes("urdhva")) return figures.wheel;
  if (value.includes("shoulder stand") || value.includes("sarvangasana")) return figures.shoulderStand;
  if (value.includes("headstand") || value.includes("sirsasana")) return figures.headstand;
  if (value.includes("plow") || value.includes("halasana")) return figures.shoulderStand;
  if (value.includes("legs-up") || value.includes("viparita")) return figures.legsWall;
  if (value.includes("corpse") || value.includes("shavasana") || value.includes("reclined")) return figures.corpse;
  if ((value.includes("forward") && category === "Seated") || value.includes("paschimottanasana") || value.includes("janu sirsasana")) return figures.forwardSeat;
  if (value.includes("twist") || value.includes("fishes") || value.includes("ardha matsyendrasana")) return figures.twist;
  if (value.includes("bound angle") || value.includes("baddha konasana")) return figures.boundAngle;
  if (value.includes("staff") || value.includes("dandasana")) return figures.staff;
  if (value.includes("lotus") || value.includes("padmasana") || value.includes("easy") || value.includes("sukhasana") || value.includes("thunderbolt") || value.includes("vajrasana")) return figures.easySeat;
  if (value.includes("forward fold") || value.includes("uttanasana")) return figures.standingFold;
  if (value.includes("halfway") || value.includes("sun salutation") || value.includes("moon salutation") || value.includes("mountain")) return figures.flow;
  if (category === "Standing") return figures.mountain;
  if (category === "Seated") return figures.easySeat;
  if (category === "Backbends") return figures.bridge;
  if (category === "Relaxation") return figures.corpse;
  if (category === "Balance and arm") return figures.tree;
  return figures.flow;
}

export default function PoseIllustration({ name, category, compact = false }) {
  const figure = figureFor(name, category);
  const alt = `Simple pose diagram for ${name}`;
  return (
    <svg
      className={`pose-illustration ${compact ? "compact" : ""}`}
      viewBox="0 0 240 180"
      role="img"
      aria-label={alt}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="21" y="12" width="198" height="151" rx="19" fill="var(--pose-bg, #edf1e9)" />
      <path d="M43 151H197" stroke="var(--pose-ground, #c8d3c5)" strokeWidth="2" strokeLinecap="round" />
      <path d="M120 148v5" stroke="var(--pose-ground, #c8d3c5)" strokeWidth="2" strokeLinecap="round" />
      {figure.lines.map((line, index) => (
        <path key={index} d={line} fill="none" stroke="var(--pose-body, #54765b)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <circle cx={figure.head[0]} cy={figure.head[1]} r="12" fill="var(--pose-skin, #c68a68)" />
      <circle cx="215" cy="26" r="3" fill="#b6c4ae" />
      <circle cx="205" cy="36" r="2" fill="#b6c4ae" />
    </svg>
  );
}
