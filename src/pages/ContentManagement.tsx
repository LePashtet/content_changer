import React, {FC, FormEvent, useCallback, useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {ContentItem, selectContent, changeContent} from "../store/reducers/contentReducer";
import {contentSagaActions} from "../store/saga/contentSagaActions";

const ContentManagementPage: FC = () => {
    const content = useAppSelector(selectContent)
    const dispatch = useAppDispatch()

    const changeInputHandler = (payload: FormEvent<HTMLInputElement>, fileName: string, field: ContentItem) => {
        const newField = {...field}
        newField.content = (payload.target as HTMLInputElement).value
        dispatch(changeContent({fileName, field: newField}))
    }

    const saveHandler = useCallback(() => {
        dispatch({type: contentSagaActions.SAVE_CONTENT})
    }, [dispatch])

    const contentMap = useMemo(() => Object.keys(content).map(item =>
        <>
            <label>{ item }</label>
            {content[item].map(field =>
                <div key={field.selector + field.tag}>
                    <label> {field.tag} </label>
                    <input defaultValue={field.content} type="text" onChange={(e) => changeInputHandler(e, item, field)}/>
                </div>
            )}

        </>
    ), [content])


    return (
        <div className="content-wrapper">
            <p id="change-me2">
                 This text can be changed
            </p>
            {contentMap}

            <button onClick={() => saveHandler()}>Save Content</button>
        </div>
    );
}
export default ContentManagementPage
