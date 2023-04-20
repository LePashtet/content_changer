import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

//TODO Replace to store/types
export interface ContentItem {
  tag: string;
  content: string;
  selector: string;
}

type ContentItems = Record<string, ContentItem[]>;

interface ContentAddPayload {
  fileName: string;
  field: ContentItem;
}

interface ContentChangePayload {
  fileName: string;
  field: ContentItem;
}

export interface SetSelectorPayload {
  fileName: string;
  field: ContentItem;
  newSelector: string;
}

interface ContentState {
  value: ContentItems;
}

const initialState: ContentState = {
  value: {},
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<ContentAddPayload>) => {
      if (state.value[action.payload.fileName]) {
        const element = state.value[action.payload.fileName].find(
          (item) => item.selector === action.payload.field.selector,
        );
        if (!element) {
          state.value[action.payload.fileName].push(action.payload.field);
        }
      } else {
        state.value[action.payload.fileName] = [action.payload.field];
      }
    },

    changeContent: (state, action: PayloadAction<ContentChangePayload>) => {
      const element = state.value[action.payload.fileName].findIndex(
        (item) => item.selector === action.payload.field.selector,
      );
      if (element !== -1) {
        state.value[action.payload.fileName][element] = action.payload.field;
      }
    },

    setSelector: (state, action: PayloadAction<SetSelectorPayload>) => {
      const element = state.value[action.payload.fileName].findIndex(
        (item) => item.selector === action.payload.field.selector,
      );
      if (element !== -1) {
        state.value[action.payload.fileName][element].selector =
          action.payload.newSelector;
      }
    },
  },
});

export const { add, changeContent, setSelector } = contentSlice.actions;

export const selectContent = (state: RootState): ContentItems =>
  state.content.value;

export default contentSlice.reducer;
