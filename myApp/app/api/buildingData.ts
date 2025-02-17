import React from "react";
const buildings = [

  {
    id: "loy1",
    name: "AD",
    longName: "Administration Building",
    openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Faculty of Arts and Science"],
    latitude: 45.457984,
    longitude: -73.639834
  },
  {
    id: "loy2",
    name: "BB",
    longName: "BB Annex",
    openHours: "Monday - Friday: 10:30 AM - 4:30 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.459793,
    longitude: -73.639174
  },
  {
    id: "loy3",
    name: "BH",
    longName: "BH Annex",
    openHours: "Monday - Friday: 10:30 AM - 4:30 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.459819,
    longitude: -73.639152
  },
  {
    id: "loy4",
    name: "CC",
    longName: "Central Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.458204,
    longitude: -73.6403
  },
  {
    id: "loy5",
    name: "CJ",
    longName: "Communication Studies and Journalism Building",
    openHours: "Monday - Friday: 8:00 AM - 6:00 PM",
    wheelchairAccessible: true,
    departments: ["Communication Studies", "Journalism"],
    latitude: 45.457478,
    longitude: -73.640354
  },
  {
    id: "loy6",
    name: "DO",
    longName: "Stinger Dome (seasonal)",
    openHours: "Monday - Sunday: 9:00 AM - 10:00 PM",
    wheelchairAccessible: false,
    departments: ["Stingers.ca"],
    latitude: 45.457878561554764,
    longitude: -73.63612164574411
   
  },
  {
    id: "loy7",
    name: "FC",
    longName: "F. C. Smith Building",
    openHours: "Not Available",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.458493,
    longitude: -73.639287
  },
  {
    id: "loy8",
    name: "GE",
    longName: "Centre for Structural and Functional Genomics",
    openHours: "Monday - Friday: 8:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.457017,
    longitude: -73.640432
  },
  {
    id: "loy9",
    name: "HA",
    longName: "Hingston Hall, wing HA",
    openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.459356,
    longitude: -73.64127
  },
  {
    id: "loy10",
    name: "HB",
    longName: "Hingston Hall, wing HB",
    openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.459308,
    longitude: -73.641849
  },
  {
    id: "loy11",
    name: "HC",
    longName: "Hingston Hall, wing HC",
    openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.459663,
    longitude: -73.64208
  },
  {
    id: "loy12",
    name: "HU",
    longName: "Applied Science Hub",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.458513,
    longitude: -73.641921
  },
  {
    id: "loy13",
    name: "JR",
    longName: "Jesuit Residence",
    openHours: "Monday - Sunday: 12:00 AM - 12:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.458432,
    longitude: -73.643235
  },
  {
    id: "loy14",
    name: "PC",
    longName: "PERFORM Centre",
    openHours: "Monday - Friday: 6:30 AM - 10:00 PM, Saturday - Sunday: 8:00 AM - 6:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.457088,
    longitude: -73.637683
  },
  {
    id: "loy15",
    name: "PS",
    longName: "Physical Services Building",
    openHours: "Monday - Friday: 10:00 AM - 4:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.459636,
    longitude: -73.639758
  },
  {
    id: "loy16",
    name: "PT",
    longName: "Oscar Peterson Concert Hall",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Oscar Peterson Concert Hall"],
    latitude: 45.459308,
    longitude: -73.638941
  },
  {
    id: "loy17",
    name: "PY",
    longName: "Psychology Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Centre for clinical research in health (CCRH)", "Psychology"],
    latitude: 45.458938,
    longitude: -73.640467
  },
  {
    id: "loy18",
    name: "QA",
    longName: "Quadrangle",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.459207978892366,
    longitude: -73.6386558034162
  },
  {
    id: "loy19",
    name: "RA",
    longName: "Recreation and Athletics Complex",
    openHours: "Monday - Friday: 9:00 AM - 9:00 PM, Saturday - Sunday: 10:00 AM - 9:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.456774,
    longitude: -73.63761
  },
  {
    id: "loy20",
    name: "RF",
    longName: "Loyola Jesuit Hall and Conference Centre",
    openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.458489,
    longitude: -73.641028
  },
  {
    id: "loy21",
    name: "SC",
    longName: "Student Centre",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.459131,
    longitude: -73.639251
  },
  {
    id: "loy22",
    name: "SH",
    longName: "Solar House",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.459298,
    longitude: -73.642478
  },
  {
    id: "loy23",
    name: "SI",
    longName: "St. Ignatius of Loyola Church",
    openHours: "Saturday: 4:30 PM (Traditional music, organ, and choir), Sunday: 10:00 AM (Contemporary band), 5:00 PM. Weekdays: Monday & Wednesday-Thursday: 9:00 AM, Tuesday: 6:30 PM. Confession: Saturday 3:45 PM - 4:15 PM.",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.4582459932296,
    longitude: -73.64267020368143
  },
  {
    id: "loy24",
    name: "SP",
    longName: "Richard J. Renaud Science Complex",
    openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
    wheelchairAccessible: true,
    departments: ["Biology", "Centre for Biological Applications of Mass Spectrometry", "Centre for NanoScience Research", "Centre for Research in Molecular Modeling", "Centre for Studies in Behavioral Neurobiology", "Chemistry and Biochemistry", "Health, Kinesiology & Applied Physiology", "Physics", "Psychology"],
    latitude: 45.457881,
    longitude: -73.641565
  },
  {
    id: "loy25",
    name: "TA",
    longName: "Terrebonne Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Centre for the Arts in Human Development (CAHD)"],
    latitude: 45.459992,
    longitude: -73.640897
  },
  {
    id: "loy26",
    name: "VE",
    longName: "Vanier Extension",
    openHours: "Monday - Friday: 10:00 AM - 4:00 PM",
    wheelchairAccessible: true,
    departments: ["Applied Human Sciences"],
    latitude: 45.459026,
    longitude: -73.638606
  },
  {
    id: "loy27",
    name: "VL",
    longName: "Vanier Library Building",
    openHours: "Monday - Friday: 12:00 AM - 12:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.459026,
    longitude: -73.638606
  },

  {
    id: "sgw1",
    name: "B",
    longName: "B Annex",
    openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.497856,
    longitude: -73.579588
  },
  {
    id: "sgw2",
    name: "CI",
    longName: "CI Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["School of Community and Public Affairs"],
    latitude: 45.497467,
    longitude: -73.579925
  },
  {
    id: "sgw3",
    name: "CL",
    longName: "CL Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.494259,
    longitude: -73.579007
  },
  {
    id: "sgw4",
    name: "D",
    longName: "D Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Theological Studies"],
    latitude: 45.497827,
    longitude: -73.579409
  },
  {
    id: "sgw5",
    name: "EN",
    longName: "EN Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.496944,
    longitude: -73.579555
  },
  {
    id: "sgw6",
    name: "ER",
    longName: "ER Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Computer Scence and Software Engineering", "Department of Creative Arts Therapies", "engAGE: Centre for Research on Aging", "Next-Generation Cities Institue", "Simone de Beauvoir Institue", "Sustainability in the Digital Age", "Urban Studies"],
    latitude: 45.496428,
    longitude: -73.57999
  },
  {
    id: "sgw7",
    name: "EV",
    longName: "Engineering, Computer Science and Visual Arts Integrated Complex",
    openHours: "Monday - Sunday: 7:00 AM - 11:00 PM",
    wheelchairAccessible: true,
    departments: ["Art Education", "Art History","Building, Civil and Environmental Engineering", "Centre for Composites (CONCOM)","Centre for Pattern Recognition and Machine Intelligence (CENPARMI)", "Chemical and Materials Engineering", "Contemporary Dance", "Design and Computation Arts"],
    latitude: 45.495376,
    longitude: -73.577997
  },
  {
    id: "sgw8",
    name: "FA",
    longName: "FA Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Department of Religions and Cultures"],
    latitude: 45.496874,
    longitude: -73.579468
  },
  {
    id: "sgw9",
    name: "FB",
    longName: "Faubourg Building",
    openHours: "Monday - Sunday: 7:00 AM - 11:00 PM",
    wheelchairAccessible: true,
    departments: ["Classics, Modern Languages & Linguistics", "Concordia Continuing Education","District 3 Innovation Centre", "Mel Hoppenheim School of Cinema"],
    latitude: 45.494666,
    longitude: -73.577603
  },
  {
    id: "sgw10",
    name: "FG",
    longName: "Faubourg Ste-Catherine Building",
    openHours: "Monday - Friday: 8:00 AM - 7:00 PM, Saturday: 9:00 AM - 7:00 PM",
    wheelchairAccessible: true,
    departments: ["Education"],
    latitude: 45.494381,
    longitude: -73.578425
  },
  {
    id: "sgw11",
    name: "GA",
    longName: "Grey Nuns Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Department of Education"],
    latitude: 45.494123,
    longitude: -73.57787
  },
  {
    id: "sgw12",
    name: "GM",
    longName: "Guy-De Maisonneuve Building",
    openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Contemporary Dance", "Music", "Theatre"],
    latitude: 45.495983,
    longitude: -73.578824
  },
  {
    id: "sgw13",
    name: "GN",
    longName: "Grey Nuns Building",
    openHours: "Monday - Friday: 7:30 AM - 9:30 PM, Saturday - Sunday: 8:00 AM - 9:30 PM",
    wheelchairAccessible: false,
    departments: ["Department of Philosophy (temporary)"],
    latitude: 45.493622,
    longitude: -73.577003
  },
  {
    id: "sgw14",
    name: "GS",
    longName: "Guy-Sherbrooke Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.496673,
    longitude: -73.581409
  },
  {
    id: "sgw15",
    name: "H",
    longName: "Henry F. Hall Building",
    openHours: "Monday - Sunday: 7:00 AM - 11:00 PM",
    wheelchairAccessible: true,
    departments: ["Geography, Planning and Environment", "Political Science, Sociology and Anthropology, Economics", "School of Irish Studies"],
    latitude: 45.497092,
    longitude: -73.5788
  },
  {
    id: "sgw16",
    name: "K",
    longName: "K Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.497777,
    longitude: -73.579531
  },
  {
    id: "sgw17",
    name: "LB",
    longName: "J.W. McConnell Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Centre for Interdisciplinary Studies in Society and Culture (CISSC)", "Centre for the Study of learning and Performance", "Education","English","Études françaises", "History","Mathematics and Statistics"],
    latitude: 45.49705,
    longitude: -73.578009
  },
  {
    id: "sgw18",
    name: "LD",
    longName: "LD Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.496697,
    longitude: -73.577312
  },
  {
    id: "sgw19",
    name: "LS",
    longName: "Learning Square (LS Building)",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.496682816489766,
    longitude: -73.57951421587161
  },
  {
    id: "sgw20",
    name: "M",
    longName: "M Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.497368,
    longitude: -73.579777
  },
  {
    id: "sgw21",
    name: "MB",
    longName: "John Molson Building",
    openHours: "Monday - Sunday: 7:00 AM - 11:00 PM",
    wheelchairAccessible: true,
    departments: ["Accountancy, Contemporary Dance", "Executive MBA Program", "Finance", "Goodman Institue of Investment Management", "Management", "Marketing", "Music","Supply Chain & Business Technology Management"," Theatre" ],
    latitude: 45.495304,
    longitude: -73.579044
  },
  {
    id: "sgw22",
    name: "MI",
    longName: "MI Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.497807,
    longitude: -73.579261
  },
  {
    id: "sgw23",
    name: "MU",
    longName: "MU Annex",
    openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.497963,
    longitude: -73.579506
  },
  {
    id: "sgw24",
    name: "P",
    longName: "P Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.496745,
    longitude: -73.579113
  },
  {
    id: "sgw25",
    name: "PR",
    longName: "PR Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.497066,
    longitude: -73.57979
  },
  {
    id: "sgw26",
    name: "Q",
    longName: "Q Annex",
    openHours: "Not Available",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.496648,
    longitude: -73.579094
  },
  {
    id: "sgw27",
    name: "R",
    longName: "R Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Religions and Cultures"],
    latitude: 45.496826,
    longitude: -73.579389
  },
  {
    id: "sgw28",
    name: "RR",
    longName: "RR Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Liberal Arts College"],
    latitude: 45.496796,
    longitude: -73.579259
  },
  {
    id: "sgw29",
    name: "S",
    longName: "S Annex",
    openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
    departments: ["Department of Philosophy"],
    latitude: 45.497423,
    longitude: -73.579851
  },
  {
    id: "sgw30",
    name: "SB",
    longName: "Samuel Bronfman Building",
    openHours: "Monday - Sunday: 12:00 AM - 12:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.4966,
    longitude: -73.58609
  },
  {
    id: "sgw31",
    name: "T",
    longName: "T Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.49671,
    longitude: -73.57927
  },
  {
    id: "sgw32",
    name: "TD",
    longName: "Toronto-Dominion Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.495103,
    longitude: -73.578375
  },
  {
    id: "sgw33",
    name: "V",
    longName: "V Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Not Available"],
    latitude: 45.497101,
    longitude: -73.579907
  },
  {
    id: "sgw34",
    name: "VA",
    longName: "Visual Arts Building",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: true,
    departments: ["Art Education", "Art History", "Creative Arts Therapies", "Studio Arts"],
    latitude: 45.495543,
    longitude: -73.573795
  },
  {
    id: "sgw35",
    name: "X",
    longName: "X Annex",
    openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
    wheelchairAccessible: false,
    departments: ["Not Available"],
    latitude: 45.49694,
    longitude: -73.579593
  },
  {
    id: "sgw36",
    name: "Z",
    longName: "Z Annex",
    openHours: "Not Available",
    wheelchairAccessible: false,
    departments: ["Not available"],
    latitude: 45.496981,
    longitude: -73.579705
  }
    
  ];
  
  export const getAllBuildings = () => buildings;
  
  export const getBuildingById = (id: string) => {
    return buildings.find((building) => building.id === id);
  };

  
