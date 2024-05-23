"use client";

import { FC, createContext, useReducer, ReactNode } from "react";
import { UserType } from "./hocs/withAuth";

// Define the interface for the store properties
interface StoreProps {
  activeUser: UserType | null;
}

// Initialize the store with default values
const initialState: StoreProps = {
  activeUser: null,
};

// Define the different types of actions that can be dispatched
export enum ActionTypes {
  UpdateUser = "UpdateUser",
}

// Define the structure of an action
interface Action {
  type: ActionTypes;
  payload: UserType | null;
}

// Define the reducer function to handle state updates based on actions
const reducer = (state: StoreProps, action: Action): StoreProps => {
  switch (action.type) {
    case ActionTypes.UpdateUser:
      return {
        ...state,
        activeUser: action.payload,
      };
    default:
      return state;
  }
};

// Define the structure of the context that will hold the state and dispatch function
interface StoreContextProps {
  state: StoreProps;
  dispatch: React.Dispatch<Action>;
}

// Create a context to provide the state and dispatch function to components
export const store = createContext<StoreContextProps>({
  state: initialState,
  dispatch: () => null,
});

// Define the StoreProvider component that will wrap the application and provide the context
const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Use the useReducer hook to manage state updates with the reducer function
  const [state, dispatch] = useReducer(reducer, initialState);

  const { Provider } = store;

  // Render the context provider with the context value and children components
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

// Export the StoreProvider component as the default export
export default StoreProvider;
