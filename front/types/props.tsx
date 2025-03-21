export type RootStackParamList = {
  Chat: {
    receiverId: string;
    receiverName: string;
  };
};

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedMessage {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

// Type pour les éléments dans la liste de messages (avec séparateurs de date)
export type MessageListItem =
  | (PopulatedMessage & { type: "message" })
  | { _id: string; type: "dateSeparator"; date: string };

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
