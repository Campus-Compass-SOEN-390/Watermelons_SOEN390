// Enum for campus locations
export enum Campus {
  SGW = "SGW",
  LOY = "LOY",
}

// Interface for building data
interface Building {
  campus: Campus;
  name: string;
  coordinates: { latitude: number; longitude: number }[];
}

// Building coordinates
export const buildings: Building[] = [
  {
    campus: Campus.SGW,
    name: "Hall Building",
    coordinates: [
      { latitude: 45.497708764170056, longitude: -73.57903745550924 },
      { latitude: 45.4971677836167, longitude: -73.57954322525673 },
      { latitude: 45.49683156812768, longitude: -73.5788507530604 },
      { latitude: 45.497373147743474, longitude: -73.57834232326353 },
    ],
  },
  {
    campus: Campus.SGW,
    name: "John Molson School of Business",
    coordinates: [
      { latitude: 45.49551994498565, longitude: -73.57920062907395 },
      { latitude: 45.49535857941148, longitude: -73.5793643521431 },
      { latitude: 45.49501011165603, longitude: -73.5787600651902 },
      { latitude: 45.495193735650766, longitude: -73.57853184516286 },
    ],
  },
  {
    campus: Campus.SGW,
    name: "Pavillon EV Building",
    coordinates: [
      { latitude: 45.49567383989148, longitude: -73.57807898778127 },
      { latitude: 45.49586446758388, longitude: -73.57849838295294 },
      { latitude: 45.49561182833434, longitude: -73.57876050493525 },
      { latitude: 45.49524664777955, longitude: -73.57790860849278 },
      { latitude: 45.495832313560506, longitude: -73.57726313311137 },
      { latitude: 45.49604131438413, longitude: -73.57771529353083 },
    ],
  },
  {
    campus: Campus.SGW,
    name: "Faubourg Ste-Catherine Building",
    coordinates: [
      { latitude: 45.494697617359805, longitude: -73.57803821546234 },
      { latitude: 45.493842086826234, longitude: -73.57907383173514 },
      { latitude: 45.493637259181746, longitude: -73.57873392697057 },
      { latitude: 45.49445099181303, longitude: -73.57761880079917 },
    ],
  },
  {
    campus: Campus.SGW,
    name: "Learning Square Building",
    coordinates: [
      { latitude: 45.49653594280453, longitude: -73.57957024371711 },
      { latitude: 45.49642006398626, longitude: -73.57968408412736 },
      { latitude: 45.49637079806912, longitude: -73.57958608238289 },
      { latitude: 45.49627087833015, longitude: -73.57967517487786 },
      { latitude: 45.496166101191235, longitude: -73.57944749405738 },
      { latitude: 45.49638328802403, longitude: -73.57923664181928 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Communications and Journalism Building",
    coordinates: [
      { latitude: 45.457829848677115, longitude: -73.64048367179865 },
      { latitude: 45.45764086780786, longitude: -73.64003307201223 },
      { latitude: 45.45748577389293, longitude: -73.64014872242203 },
      { latitude: 45.45743675806403, longitude: -73.64002977944575 },
      { latitude: 45.45748129509062, longitude: -73.6398246733914 },
      { latitude: 45.457301896333526, longitude: -73.63978009172298 },
      { latitude: 45.45721466553898, longitude: -73.64001942489027 },
      { latitude: 45.45736279322334, longitude: -73.64007339217311 },
      { latitude: 45.457415460750646, longitude: -73.64020479077476 },
      { latitude: 45.45718174822294, longitude: -73.64038781025562 },
      { latitude: 45.457334813579436, longitude: -73.64072334597056 },
      { latitude: 45.457598150854814, longitude: -73.64050513043567 },
      { latitude: 45.457654109867384, longitude: -73.64062245061571 },
      { latitude: 45.45783021580933, longitude: -73.64048166639967 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Central Building",
    coordinates: [
      { latitude: 45.45879783164691, longitude: -73.64116974399921 },
      { latitude: 45.45839267330936, longitude: -73.64143115333147 },
      { latitude: 45.45781370224986, longitude: -73.63984341091212 },
      { latitude: 45.458255329639066, longitude: -73.63945350094436 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Hingston Hall C Building",
    coordinates: [
      { latitude: 45.459906138169075, longitude: -73.64203607306884 },
      { latitude: 45.45963415262996, longitude: -73.64225135213151 },
      { latitude: 45.45954317786371, longitude: -73.64201735315037 },
      { latitude: 45.459828294166044, longitude: -73.64181544545804 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Hingston Hall B Building",
    coordinates: [
      { latitude: 45.45955663320831, longitude: -73.64198943146944 },
      { latitude: 45.459140240357215, longitude: -73.64233198897811 },
      { latitude: 45.4589276398003, longitude: -73.64182981043137 },
      { latitude: 45.45936919390666, longitude: -73.64150698136561 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Hingston Hall A Building",
    coordinates: [
      { latitude: 45.45969784997463, longitude: -73.64136123390169 },
      { latitude: 45.45942894983393, longitude: -73.64155628153311 },
      { latitude: 45.45925345641895, longitude: -73.641076060813 },
      { latitude: 45.45950631772512, longitude: -73.64087697771338 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Concordia Applied Psychology Centre Building",
    coordinates: [
      { latitude: 45.45921923334769, longitude: -73.64058679662563 },
      { latitude: 45.45879999060788, longitude: -73.64086057116744 },
      { latitude: 45.45866366275162, longitude: -73.6404718531157 },
      { latitude: 45.459065315920746, longitude: -73.6401646404619 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Richard J. Renaud Science Complex Building",
    coordinates: [
      { latitude: 45.45832821103611, longitude: -73.64141343267241 },
      { latitude: 45.45827742437653, longitude: -73.64128710966807 },
      { latitude: 45.458215831983296, longitude: -73.64133486592581 },
      { latitude: 45.45818557604618, longitude: -73.64126400180143 },
      { latitude: 45.45825797415436, longitude: -73.64120084029926 },
      { latitude: 45.458193140032016, longitude: -73.64103908523273 },
      { latitude: 45.458340097268966, longitude: -73.6409235458995 },
      { latitude: 45.45831524423375, longitude: -73.64086500597067 },
      { latitude: 45.45752534422485, longitude: -73.64146889156062 },
      { latitude: 45.45720981336176, longitude: -73.64065395413022 },
      { latitude: 45.45698829235157, longitude: -73.64082957391673 },
      { latitude: 45.45744213934359, longitude: -73.64200037251645 },
      { latitude: 45.45764312756321, longitude: -73.64184786058948 },
      { latitude: 45.457677706108356, longitude: -73.6419233462872 },
      { latitude: 45.45832604990376, longitude: -73.64141343269652 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Perform Centre Building",
    coordinates: [
      { latitude: 45.457284244031285, longitude: -73.63763317156965 },
      { latitude: 45.45701819500725, longitude: -73.63783558975122 },
      { latitude: 45.45668459808416, longitude: -73.63699447342395 },
      { latitude: 45.45695340567661, longitude: -73.636780263892 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Centre for Structural and Functional Genomics Building",
    coordinates: [
      { latitude: 45.457171556137446, longitude: -73.64057071367107 },
      { latitude: 45.456952508899235, longitude: -73.64074464211575 },
      { latitude: 45.45680693906143, longitude: -73.64034342081722 },
      { latitude: 45.4570440097478, longitude: -73.64017344529175 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Vanier Library",
    coordinates: [
      { latitude: 45.459485372131994, longitude: -73.63913679975713 },
      { latitude: 45.45935160556695, longitude: -73.63923974928578 },
      { latitude: 45.45932201115127, longitude: -73.63918067988408 },
      { latitude: 45.45926755738584, longitude: -73.63921949691948 },
      { latitude: 45.45930425449441, longitude: -73.63932413414534 },
      { latitude: 45.45921783868454, longitude: -73.6393308849341 },
      { latitude: 45.45921783868454, longitude: -73.63933594802567 },
      { latitude: 45.459112482243995, longitude: -73.63941864518803 },
      { latitude: 45.45899292020223, longitude: -73.63912667357397 },
      { latitude: 45.45908170392085, longitude: -73.63900515937621 },
      { latitude: 45.45903672018755, longitude: -73.63887858208687 },
      { latitude: 45.45884257945327, longitude: -73.6390254117425 },
      { latitude: 45.45861884326248, longitude: -73.63841615304815 },
      { latitude: 45.4588567848922, longitude: -73.63820012780769 },
      { latitude: 45.458812984767114, longitude: -73.63807017512399 },
      { latitude: 45.45910301198917, longitude: -73.63784908679193 },
      { latitude: 45.459213103564494, longitude: -73.63813261992004 },
      { latitude: 45.459134974081564, longitude: -73.6382018155049 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Concordia Stadium",
    coordinates: [
      { latitude: 45.45880466836896, longitude: -73.63716203195673 },
      { latitude: 45.45782822337074, longitude: -73.63834462554809 },
      { latitude: 45.45742531638041, longitude: -73.63756073493894 },
      { latitude: 45.457624400194284, longitude: -73.63731070086536 },
      { latitude: 45.45753433855599, longitude: -73.6371485166014 },
      { latitude: 45.4580652261379, longitude: -73.6365335679339 },
      { latitude: 45.45816440414564, longitude: -73.6366925663031 },
      { latitude: 45.458387150799744, longitude: -73.6364310451045 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Loyola Jesuit Hall and Conference Centre Building",
    coordinates: [
      { latitude: 45.45862022823182, longitude: -73.64002729351685 },
      { latitude: 45.45851645293705, longitude: -73.64011576618299 },
      { latitude: 45.45839267330936, longitude: -73.63974897325465 },
      { latitude: 45.45861884326248, longitude: -73.63954989015503 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Loyola Administration Building",
    coordinates: [
      { latitude: 45.45861884326248, longitude: -73.63954989015503 },
      { latitude: 45.45839267330936, longitude: -73.63974897325465 },
      { latitude: 45.458255329639066, longitude: -73.63945350094436 },
      { latitude: 45.45848550455252, longitude: -73.63925441784474 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Loyola Hall Building",
    coordinates: [
      { latitude: 45.45848550455252, longitude: -73.63925441784474 },
      { latitude: 45.458255329639066, longitude: -73.63945350094436 },
      { latitude: 45.458215831983296, longitude: -73.63933486592581 },
      { latitude: 45.45826751828954, longitude: -73.63923686418134 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Jesuit Residence Building",
    coordinates: [
      { latitude: 45.45847571531779, longitude: -73.64341800596794 },
      { latitude: 45.45838340608896, longitude: -73.64317511614011 },
      { latitude: 45.45855005821098, longitude: -73.64304174754373 },
      { latitude: 45.45864732334826, longitude: -73.64330583502928 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Terrebonne Building",
    coordinates: [
      { latitude: 45.45968821064703, longitude: -73.64035807183336 },
      { latitude: 45.459292890682676, longitude: -73.63945965226893 },
      { latitude: 45.45962819525333, longitude: -73.63918250006375 },
      { latitude: 45.460011770799426, longitude: -73.64017764388771 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "BH,BB Annex Building",
    coordinates: [
      { latitude: 45.459726448812404, longitude: -73.63924092703135 },
      { latitude: 45.459665074618606, longitude: -73.63909625860624 },
      { latitude: 45.45975672672339, longitude: -73.63901575762776 },
      { latitude: 45.45981646417578, longitude: -73.63916859281879 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "Applied Science Hub Building",
    coordinates: [
      { latitude: 45.458446186335834, longitude: -73.64211713925434 },
      { latitude: 45.458294086004564, longitude: -73.64171981633193 },
      { latitude: 45.458577502440896, longitude: -73.64150701286837 },
      { latitude: 45.458729602007686, longitude: -73.64190568264816 },
    ],
  },
  {
    campus: Campus.LOY,
    name: "St. Ignatius of Loyola Church",
    coordinates: [
      { latitude: 45.45763825199133, longitude: -73.64257106756277 },
      { latitude: 45.4575696249186, longitude: -73.6423945340532 },
      { latitude: 45.45771090577136, longitude: -73.64214275474285 },
      { latitude: 45.45792619309263, longitude: -73.64194166629126 },
      { latitude: 45.45816557532826, longitude: -73.64252279985682 },
      { latitude: 45.457964251173095, longitude: -73.6426822757242 },
      { latitude: 45.457889971914376, longitude: -73.64250464294128 },
      { latitude: 45.45764197432576, longitude: -73.64256954722735 },
    ],
  },
];
