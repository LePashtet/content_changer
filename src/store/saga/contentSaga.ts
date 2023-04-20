import {takeEvery, put, select, call, all} from "redux-saga/effects";
import {contentSagaActions} from "./contentSagaActions";
import {selectContent, setSelector} from "../reducers/contentReducer";
import {db} from "../../db";

function* setNewSelector(item: any, key: any) {
    for (const field of item) {
        yield put(setSelector({fileName: key, field: field, newSelector: field.content}))
    }
}

//TODO Deal with any
export function* saveContent(): any {
    try {
        const content = yield select(selectContent)
        yield window.showDirectoryPicker()


        Object.keys(content).forEach(async (key) => {
            // @ts-expect-error  This 'file' is FileSystemFileHandle
            const {file} = await db.files.where('name').equals(key).first()
            const fileHandler = await file.getFile()
            const html = await fileHandler.text()
            const writable = await file.createWritable();

            let newHtml = html
            for (const item of content[key]) {
                newHtml = newHtml.replace(item.selector, item.content)
            }
            await writable.write(newHtml)
            await writable.close();
        })

        yield all(Object.keys(content).map((key) => {
            return call(setNewSelector, content[key], key)
        }));


    } catch (e) {
        console.log(e)
        //TODO Add error handling
        yield put({type: "FAIL"});
    }
}

export default function* rootSaga() {
    yield takeEvery(contentSagaActions.SAVE_CONTENT, saveContent);
}
