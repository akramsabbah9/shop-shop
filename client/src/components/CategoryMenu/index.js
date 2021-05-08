import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_CATEGORIES } from "../../utils/queries";
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
// import { useStoreContext } from "../../utils/GlobalState";
import { useDispatch, useSelector } from "react-redux";

function CategoryMenu() {
    const dispatch = useDispatch();
    const state = useSelector(state => state);

    const { categories } = state;

    const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

    useEffect(() => {
        // if categoryData exists or has changed from the response of useQuery, then run dispatch()
        if (categoryData) {
            // execute dispatch function, with action object indicating type of action and data to set categories state to
            dispatch({
                type: UPDATE_CATEGORIES,
                categories: categoryData.categories
            });
            // add category data to IndexedDB store
            categoryData.categories.forEach(category => {
                idbPromise("categories", "put", category);
            });
        }
        // if offline, use indexedDB categories
        else if (!loading) {
            idbPromise("categories", "get").then(categories => {
                dispatch({
                    type: UPDATE_CATEGORIES,
                    categories: categories
                });
            });
        }
    }, [categoryData, loading, dispatch]);

    const handleClick = id => {
        dispatch({
            type: UPDATE_CURRENT_CATEGORY,
            currentCategory: id
        });
    };

    return (
        <div>
            <h2>Choose a Category:</h2>
            {categories.map(item => (
                <button
                    key={item._id}
                    onClick={() => {
                        handleClick(item._id);
                    }}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
}

export default CategoryMenu;
