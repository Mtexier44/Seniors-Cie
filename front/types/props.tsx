export type RootStackParamList = {};

export type AuthStackParamList = {
  login: undefined;
  register: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Menu: undefined;
  listedesheros: { searchQuery?: string };
  HeroCreation: undefined;
  HeroDetail: { heroId: string };
};
