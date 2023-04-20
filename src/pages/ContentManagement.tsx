import React, {
  FC,
  FormEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  ContentItem,
  selectContent,
  changeContent,
} from '../store/reducers/contentReducer';
import { contentSagaActions } from '../store/saga/contentSagaActions';

const ContentManagementPage: FC = () => {
  const content = useAppSelector(selectContent);
  const dispatch = useAppDispatch();

  const [activePage, setActivePage] = useState<{
    name: string | null;
    index: number | null;
  }>({ name: null, index: null });

  useLayoutEffect(() => {
    setActivePage({ name: Object.keys(content)[0], index: 0 });
  }, []);

  const saveHandler = useCallback(() => {
    dispatch({ type: contentSagaActions.SAVE_CONTENT });
  }, [dispatch]);

  const changeInputHandler = (
    payload: FormEvent<HTMLInputElement>,
    fileName: string,
    field: ContentItem,
  ) => {
    const newField = { ...field };
    newField.content = (payload.target as HTMLInputElement).value;
    dispatch(changeContent({ fileName, field: newField }));
  };

  const contentMap = useMemo(
    () =>
      activePage.name && (
        <>
          {content[activePage.name as string].map((field) => (
            <div key={field.selector + field.tag}>
              <label className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <input
                  defaultValue={field.content}
                  type="text"
                  onChange={(e) =>
                    changeInputHandler(e, activePage.name as string, field)
                  }
                  className="peer h-8 w-full max-w-xl border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                />

                <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                  Tag: {field.tag.toLowerCase()}
                </span>
              </label>
            </div>
          ))}
        </>
      ),
    [content, activePage],
  );

  if (activePage.name) {
    return (
      <div>
        <ul className="flex border-b border-gray-100">
          {Object.keys(content).map((item, index) => (
            <li
              onClick={() => setActivePage({ name: item, index })}
              className="flex-1 cursor-pointer"
              key={item}
            >
              <span className="relative block p-4">
                {item === activePage.name && (
                  <span className="absolute inset-x-0 -bottom-px h-px w-full bg-pink-600"></span>
                )}

                <div className="flex items-center justify-center gap-4">
                  <span className="text-sm font-medium text-gray-900">
                    {item}
                  </span>
                </div>
              </span>
            </li>
          ))}
        </ul>

        {contentMap}

        <button
          onClick={() => saveHandler()}
          className="flex mx-auto mt-10 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
        >
          <span className="block rounded-full bg-white px-8 py-3 text-sm font-medium hover:bg-transparent">
            Save Content
          </span>
        </button>
      </div>
    );
  }
  return <></>;
};
export default ContentManagementPage;
