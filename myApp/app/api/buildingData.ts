import React from "react";
const buildings = [

    {
        id: "loy1",
        name: "AD",
        longName: "Administration Building",
        openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Faculty of Arts and Science"],
        
      },
      {
        id: "loy2",
        name: "BB",
        longName: "BB Annex",
        openHours: "Monday - Friday: 10:30 AM - 4:30 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "loy3",
        name: "BH",
        longName: "BH Annex",
        openHours: "Monday - Friday: 10:30 AM - 4:30 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "loy4",
        name: "CC",
        longName: "Central Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy5",
        name: "CJ",
        longName: "Communication Studies and Journalism Building",
        openHours: "Monday - Friday: 8:00 AM - 6:00 PM",
        wheelchairAccessible: true,
        departments: ["Communication Studies", "Journalism"]
      },
      {
        id: "loy6",
        name: "DO",
        longName: "Stinger Dome (seasonal)",
        openHours: "Monday - Sunday: 9:00 AM - 10:00 PM",
        wheelchairAccessible: false,
        departments: ["Stingers.ca"]
      },
      {
        id: "loy7",
        name: "FC",
        longName: "F. C. Smith Building",
        openHours: "Not Available",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "loy8",
        name: "GE",
        longName: "Centre for Structural and Functional Genomics",
        openHours: "Monday - Friday: 8:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy9",
        name: "HA",
        longName: "Hingston Hall, wing HA",
        openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy10",
        name: "HB",
        longName: "Hingston Hall, wing HB",
        openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy11",
        name: "HC",
        longName: "Hingston Hall, wing HC",
        openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "loy12",
        name: "HU",
        longName: "Applied Science Hub",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy13",
        name: "JR",
        longName: "Jesuit Residence",
        openHours: "Monday - Sunday: 12:00 AM - 12:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "loy14",
        name: "PC",
        longName: "PERFORM Centre",
        openHours: "Monday - Friday: 6:30 AM - 10:00 PM, Saturday - Sunday: 8:00 AM - 6:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy15",
        name: "PS",
        longName: "Physical Services Building",
        openHours: "Monday - Friday: 10:00 AM - 4:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy16",
        name: "PT",
        longName: "Oscar Peterson Concert Hall",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Oscar Peterson Concert Hall"]
      },
      {
        id: "loy17",
        name: "PY",
        longName: "Psychology Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Centre for clinical research in health (CCRH)", "Psychology"]
      },
      {
        id: "loy18",
        name: "QA",
        longName: "Quadrangle",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy19",
        name: "RA",
        longName: "Recreation and Athletics Complex",
        openHours: "Monday - Friday: 9:00 AM - 9:00 PM, Saturday - Sunday: 10:00 AM - 9:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy20",
        name: "RF",
        longName: "Loyola Jesuit Hall and Conference Centre",
        openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy21",
        name: "SC",
        longName: "Student Centre",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "loy22",
        name: "SH",
        longName: "Solar House",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "loy23",
        name: "SI",
        longName: "St. Ignatius of Loyola Church",
        openHours: "Saturday: 4:30 PM (Traditional music, organ, and choir), Sunday: 10:00 AM (Contemporary band), 5:00 PM. Weekdays: Monday & Wednesday-Thursday: 9:00 AM, Tuesday: 6:30 PM. Confession: Saturday 3:45 PM - 4:15 PM.",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "loy24",
        name: "SP",
        longName: "Richard J. Renaud Science Complex",
        openHours: "Monday - Friday: 9:00 AM - 6:00 PM",
        wheelchairAccessible: true,
        departments: ["Biology", "Centre for Biological Applications of Mass Spectrometry", "Centre for NanoScience Research", "Centre for Research in Molecular Modeling", "Centre for Studies in Behavioral Neurobiology", "Chemistry and Biochemistry", "Health, Kinesiology & Applied Physiology", "Physics", "Psychology"]
      },
      {
        id: "loy25",
        name: "TA",
        longName: "Terrebonne Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Centre for the Arts in Human Development (CAHD)"]
      },
      {
        id: "loy26",
        name: "VE",
        longName: "Vanier Extension",
        openHours: "Monday - Friday: 10:00 AM - 4:00 PM",
        wheelchairAccessible: true,
        departments: ["Applied Human Sciences"]
      },
      {
        id: "loy27",
        name: "VL",
        longName: "Vanier Library Building",
        openHours: "Monday - Friday: 12:00 AM - 12:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      }
 ,

      {
        id: "sgw1",
        name: "B",
        longName: "B Annex",
        openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      
      },
      {
        id: "sgw2",
        name: "CI",
        longName: "CI Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["School of Community and Public Affairs"]
      
      },
      {
        id: "sgw3",
        name: "CL",
        longName: "CL Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "sgw4",
        name: "D",
        longName: "D Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Theological Studies"]
      },
      {
        id: "sgw5",
        name: "EN",
        longName: "EN Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw6",
        name: "ER",
        longName: "ER Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Computer Scence and Software Engineering", "Department of Creative Arts Therapies", "engAGE: Centre for Research on Aging", "Next-Generation Cities Institue", "Simone de Beauvoir Institue", "Sustainability in the Digital Age", "Urban Studies"]
      },
      {
        id: "sgw7",
        name: "EV",
        longName: "Engineering, Computer Science and Visual Arts Integrated Complex",
        openHours: "Monday - Sunday: 7:00 AM - 11:00 PM",
        wheelchairAccessible: true,
        departments: ["Art Education", "Art History","Building, Civil and Environmental Engineering", "Centre for Composites (CONCOM)","Centre for Pattern Recognition and Machine Intelligence (CENPARMI)", "Chemical and Materials Engineering", "Contemporary Dance", "Design and Computation Arts"]
      },
      {
        id: "sgw8",
        name: "FA",
        longName: "FA Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Department of Religions and Cultures"]
      },
      {
        id: "sgw9",
        name: "FB",
        longName: "Faubourg Building",
        openHours: "Monday - Sunday: 7:00 AM - 11:00 PM",
        wheelchairAccessible: true,
        departments: ["Classics, Modern Languages & Linguistics", "Concordia Continuing Education","District 3 Innovation Centre", "Mel Hoppenheim School of Cinema"]
      },
      {
        id: "sgw10",
        name: "FG",
        longName: "Faubourg Ste-Catherine Building",
        openHours: "Monday - Friday: 8:00 AM - 7:00 PM, Saturday: 9:00 AM - 7:00 PM",
        wheelchairAccessible: true,
        departments: ["Education"]
  
      },
      {
        id: "sgw11",
        name: "GA",
        longName: "Grey Nuns Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Department of Education"]
   
      },
      {
        id: "sgw12",
        name: "GM",
        longName: "Guy-De Maisonneuve Building",
        openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Contemporary Dance", "Music", "Theatre"]
      },
      {
        id: "sgw13",
        name: "GN",
        longName: "Grey Nuns Building",
        openHours: "Monday - Friday: 7:30 AM - 9:30 PM, Saturday - Sunday: 8:00 AM - 9:30 PM",
        wheelchairAccessible: false,
        departments: ["Department of Philosophy (temporary)"]
      },
      {
        id: "sgw14",
        name: "GS",
        longName: "GS Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw15",
        name: "H",
        longName: "Henry F. Hall Building",
        openHours: "Monday - Sunday: 7:00 AM - 11:00 PM",
        wheelchairAccessible: true,
        departments: ["Geography, Planning and Environment", "Political Science, Sociology and Anthropology, Economics", "School of Irish Studies"]
      },
      {
        id: "sgw16",
        name: "K",
        longName: "K Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw17",
        name: "LB",
        longName: "J.W. McConnell Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Centre for Interdisciplinary Studies in Society and Culture (CISSC)", "Centre for the Study of learning and Performance", "Education","English","Études françaises", "History","Mathematics and Statistics"]
      },
      {
        id: "sgw18",
        name: "LD",
        longName: "LD Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw19",
        name: "LS",
        longName: "Learning Square (LS Building)",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw20",
        name: "M",
        longName: "M Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw21",
        name: "MB",
        longName: "John Molson Building",
        openHours: "Monday - Sunday: 7:00 AM - 11:00 PM",
        wheelchairAccessible: true,
        departments: ["Accountancy, Contemporary Dance", "Executive MBA Program", "Finance", "Goodman Institue of Investment Management", "Management", "Marketing", "Music","Supply Chain & Business Technology Management"," Theatre" ]
      },
      {
        id: "sgw22",
        name: "MI",
        longName: "MI Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw23",
        name: "MU",
        longName: "MU Annex",
        openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw24",
        name: "P",
        longName: "P Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw25",
        name: "PR",
        longName: "PR Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw26",
        name: "Q",
        longName: "Q Annex",
        openHours: "Not Available",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw27",
        name: "R",
        longName: "R Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Religions and Cultures"],
      },
      {
        id: "sgw28",
        name: "RR",
        longName: "RR Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Liberal Arts College"]
      },
      {
        id: "sgw29",
        name: "S",
        longName: "S Annex",
        openHours: "Monday - Friday: 9:00 AM - 5:00 PM",
        departments: ["Department of Philosophy"]
      },
      {
        id: "sgw30",
        name: "SB",
        longName: "Samuel Bronfman Building",
        openHours: "Monday - Sunday: 12:00 AM - 12:00 PM",
        wheelchairAccessible: true,
        departments: ["Not Available"]
      },
      {
        id: "sgw31",
        name: "T",
        longName: "T Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw32",
        name: "TD",
        longName: "Toronto-Dominion Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw33",
        name: "V",
        longName: "V Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: [],
        services: []
      },
      {
        id: "sgw34",
        name: "VA",
        longName: "Visual Arts Building",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: true,
        departments: ["Art Education", "Art History", "Creative Arts Therapies", "Studio Arts"]
      },
      {
        id: "sgw35",
        name: "X",
        longName: "X Annex",
        openHours: "Monday - Friday: 10:00 AM - 6:00 PM, Saturday - Sunday: 11:00 AM - 5:00 PM",
        wheelchairAccessible: false,
        departments: ["Not Available"]
      },
      {
        id: "sgw36",
        name: "Z",
        longName: "Z Annex",
        openHours: "Not Available",
        wheelchairAccessible: false,
        departments: ["Not available"]
      }
    
  ];
  
  export const getAllBuildings = () => buildings;
  
  export const getBuildingById = (id: string) => {
    return buildings.find((building) => building.id === id);
  };

  
