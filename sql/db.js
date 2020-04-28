const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

//===================== getting stuff for main load =====================
module.exports.getAllData = () => {
    return db.query(`
    SELECT * 
    FROM images
    ORDER BY id DESC
    LIMIT 9;`);
};

module.exports.getMoreImages = (startId) => {
    return db
        .query(
            `
    SELECT * FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 6
    `,
            [startId]
        )
        .then(({ rows }) => rows);
};

//==================== getting stuff for modal ==========================
module.exports.getImage = (id) => {
    return db.query(
        `
    SELECT * FROM images WHERE id = $1;`,
        [id]
    );
};

module.exports.getComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1;`, [id]);
};

//========================== adding stuff ================================

module.exports.addData = (url, username, title, description) => {
    return db.query(
        `
    INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4)
    RETURNING id, url, username, title, description;
    `,
        [url, username, title, description]
    );
};

module.exports.addComment = (comment, username, image_id) => {
    return db.query(
        `
    INSERT INTO comments (comment, username, image_id)
    VALUES ($1, $2, $3)
    RETURNING * ;
    `,
        [comment, username, image_id]
    );
};
