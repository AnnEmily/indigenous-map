import { assertExhaustive } from "../shared/utilsString";
import { Nation, NationInfo } from "../shared/types";

// export type NationInfo = {
//   nation: Nation;
//   nationNameNative: string;
//   language: string;
//   territoryName: string;
//   government: string[];
//   websites: string[];
//   population: string;
//   formerNamesFR: string[];
//   formerNamesEN: string[];
//   families: string[];
// };

export const getNationInfo = (nation: Nation): NationInfo => {
  const nationInfo: NationInfo = {
    nation,
    families: [],
    formerNamesEN: [],
    formerNamesFR: [],
    government: [],
    language: null,
    nationNameNative: null,
    population: null,
    territoryArea: null,
    territoryName: null,
    websites: [],
  };

  switch(nation) {
    case 'abenaki':
      break;
    case 'anishinabe':
      nationInfo.formerNamesFR = ['Algonquins'];
      break;
    case 'attikamek':
      nationInfo.territoryArea = "80000 km2";
      nationInfo.territoryName = "Nitaskinan ('our land')";
      break;
    case 'cree':
      nationInfo.language = ['Eeyou-ayimun', 'Nehlueun'];
      nationInfo.territoryName = "Eeyou-Istchee";
      break;
    case 'innu':
      nationInfo.formerNamesFR = ['Montagnais'];
      nationInfo.language = ["Innu-aimun"];
      nationInfo.population = "10000";
      nationInfo.territoryName = "Nitassinan";
      break;
    case 'inuit':
      nationInfo.language = ["Inuktitut"];
      nationInfo.formerNamesFR = ['Esquimau'];
      nationInfo.formerNamesEN = ['Eskimo'];
      nationInfo.territoryArea = "560000 km2";
      nationInfo.territoryName = "Nunavik ('the place where we live')";
      break;
    case 'southern_inuit':
      nationInfo.formerNamesEN = ['Labrador Metis'];
      nationInfo.formerNamesFR = ['Métis du Labrador'];
      nationInfo.population = "6000";
      nationInfo.websites = [
        'https://nunatukavut.ca',
        'https://policyoptions.irpp.org/2023/12/inuit-identity-labrador/',
      ];
      break;
    case 'micmac':
      break;
    case 'mohawk':
      nationInfo.formerNamesFR = ['Iroquois'];
      break;
    case 'naskapi':
      break;
    case 'wendat':
      nationInfo.formerNamesFR = ['Huron-Wendat'];
      break;
    case 'wolastoqiyik':
      nationInfo.formerNamesFR = ['Malécite'];
      nationInfo.formerNamesEN = ['Maliseet'];
      nationInfo.language = ["Wolastoqey"];
      nationInfo.territoryName = "Wolastokuk ('the land of the beautiful river')";
      break;
    default:
      assertExhaustive(nation);
  }

  return nationInfo;
};
