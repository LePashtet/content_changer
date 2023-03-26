import {takeEvery, put, select} from "redux-saga/effects";
import {contentSagaActions} from "./contentSagaActions";
import {selectContent} from "../reducers/contentReducer";
import {db} from "../../db";

export function* saveContent(): any {
    try {
        const content = yield select(selectContent)
        yield window.showDirectoryPicker()


        Object.keys(content).forEach(async (key) => {
            // @ts-expect-error  This 'file' is FileSystemFileHandle
            const { file } = await db.files.where('name').equals(key).first()
            const fileHandler = await file.getFile()
            const html = await fileHandler.text()
            const writable = await file.createWritable();

            let newHtml = ""
            for (const item of content[key]) {
                newHtml = html.replace(item.selector, item.content)
            }
            await writable.write(newHtml)
            await writable.close();

        })
    } catch (e) {
        //TODO Add error handling
        yield put({ type: "FAIL" });
    }
}

export default function* rootSaga() {
    yield takeEvery(contentSagaActions.SAVE_CONTENT, saveContent);
}
