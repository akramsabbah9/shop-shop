export function pluralize(name, count) {
    if (count === 1) {
        return name
    }
    return name + "s"
}

export function idbPromise(storeName, method, object) {
    return new Promise((resolve, reject) => {
        // open connection to database `shop-shop` w/ version of 1
        const request = window.indexedDB.open("shop-shop", 1);

        // create variables for database, transaction, object store
        let db, tx, store;

        // if version changed / first time using this, create the object stores
        request.onupgradeneeded = function(e) {
            const db = request.result;
            // create object store for each type of data.
            // set primary key index to be the _id of the data
            db.createObjectStore("products", { keyPath: "_id" });
            db.createObjectStore("categories", { keyPath: "_id" });
            db.createObjectStore("cart", { keyPath: "_id" });
        };

        // handle any errors with connecting
        request.onerror = function(e) {
            console.log("There was an error");
        };

        // on database open success
        request.onsuccess = function(e) {
            // save reference of the database to `db` variable
            db = request.result;
            // open a transaction for one of the object stores
            tx = db.transaction(storeName, "readwrite");
            // save reference to that object store
            store = tx.objectStore(storeName);

            // if an error occurs, log it
            db.onerror = function(e) {
                console.log("Error: ", e);
            };

            switch (method) {
                case "put":
                    store.put(object);
                    resolve(object);
                    break;
                case "get":
                    const all = store.getAll();
                    all.onsuccess = function() {
                        resolve(all.result);
                    };
                    break;
                case "delete":
                    store.delete(object._id);
                    break;
                default:
                    console.log("No valid method");
                    break;
            }

            // when transaction completes, close connection
            tx.oncomplete = function() {
                db.close();
            };
        };
    });
}
