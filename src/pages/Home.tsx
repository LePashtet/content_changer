import React, { useCallback, FC } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch } from '../store/hooks';
import { add } from '../store/reducers/contentReducer';

import { db } from '../db';

const HomePage: FC = () => {
  const dispatch = useAppDispatch();

  const createCssSelector = (el: HTMLElement) => {
    return `${el.nodeName}${el.id ? '#' + el.id : ''}${
      el.getAttribute('className')
        ? '.' + el.getAttribute('className')?.split(' ').join('.')
        : ''
    }`;
  };

  const parseHandle = useCallback(async () => {
    //Request access
    const dirHandle = await window.showDirectoryPicker();

    const parse = async (dirHandle: any) => {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const fileName = entry.name;
          //Get file and write a copy to Indexed
          const fileHandle = await dirHandle.getFileHandle(entry.name, {});

          //Get raw file
          const file = await fileHandle.getFile();
          const rawText = await file.text();

          //Minify HTML to beautify the content and for regexes
          const html = rawText
            .replace(/(\r\n|\n|\r)/gm, '')
            .replace(/\s\s+/g, ' ')
            .trim();
          // TODO Go through and decide whether we need it or not
          const tagsRegex = /<(a|p|span).*?>(.*?)<\/\1>/g;
          const tagRegex = /(?<=\<)\S+(?=\s)/g;
          const contentRegex = /(?<=\>)[^<]*(?=\<)/;
          const selectorRegex = /(?<=\<\S+)(.*?)(?=\>)/;

          // Better and current option to use DOM
          const el = document.createElement('html');
          el.innerHTML = html;
          const a = el.getElementsByTagName('a');
          const p = el.getElementsByTagName('p');
          const span = el.getElementsByTagName('span');

          //Write a file to IndexedDB if have content
          if (a.length || p.length || span.length) {
            await db.files.add({
              name: fileName,
              file: fileHandle,
            });
          }

          //Triggers only on 3 tags
          if (a.length) {
            for (let i = 0; i < a.length; i++) {
              if (a.item(i)) {
                dispatch(
                  add({
                    fileName: fileName,
                    field: {
                      tag: a.item(i)?.tagName || '',
                      content: a.item(i)?.textContent || '',
                      selector: a.item(i)?.textContent?.trim() || '', // createCssSelector(a.item(i) as HTMLElement)
                    },
                  }),
                );
              }
            }
          }
          if (p.length) {
            for (let i = 0; i < p.length; i++) {
              if (p.item(i)) {
                dispatch(
                  add({
                    fileName: fileName,
                    field: {
                      tag: p.item(i)?.tagName || '',
                      content: p.item(i)?.textContent || '',
                      selector: p.item(i)?.textContent?.trim() || '',
                    },
                  }),
                );
              }
            }
          }
          if (span.length) {
            for (let i = 0; i < span.length; i++) {
              if (span.item(i)) {
                dispatch(
                  add({
                    fileName: fileName,
                    field: {
                      tag: span.item(i)?.tagName || '',
                      content: span.item(i)?.textContent || '',
                      selector: span.item(i)?.textContent?.trim() || '',
                    },
                  }),
                );
              }
            }
          }
        } else if (entry.name !== 'node_modules') {
          const subDir = await dirHandle.getDirectoryHandle(entry.name, {
            create: true,
          });
          await parse(subDir);
        }
      }
    };

    if (dirHandle) {
      await db.files.clear();
      //Start files parsing
      await parse(dirHandle);
    }
  }, [dispatch]);

  return (
    <>
      <button
        onClick={() => parseHandle()}
        className="flex mx-auto rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
      >
        <span className="block rounded-full bg-white px-8 py-3 text-sm font-medium hover:bg-transparent">
          Start the magic
        </span>
      </button>
    </>
  );
};

export default HomePage;
