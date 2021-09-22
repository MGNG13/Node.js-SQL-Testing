/* INSERT DATA, AUTOINCREMENT ID */
INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ('Hector Laboe', '15');
INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ('Valeria Muñoz', '16');
INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ('Florentina Vicencio', '18');
INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ('Juan De la Patada', '3');
INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ('Derbez', '90');
INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ('Juan Carlos', '73');
INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ('Miguel Aleman', '22');


/* SELECT TABLE FROM ALL DATA TABLE */
SELECT * FROM `nodejs`;
/* SELECT ALL DATA FROM TABLE, EQUALS WITH 'Juan' */
SELECT * FROM `nodejs` WHERE nombre LIKE '%Juan%';
/* SELECT ID FROM TABLE, EQUALS WITH 'Juan' */
SELECT id FROM `nodejs` WHERE nombre LIKE '%Juan%';
/* SELECT ID FROM TABLE, EQUALS WITH 'Juan' and edad = '15' */
SELECT id FROM `nodejs` WHERE nombre LIKE 'Juan Valhala' AND edad LIKE '10';



/* DELETE USER FROM TABLE IF EQUALS WITH ID 1 */
DELETE FROM `nodejs` WHERE id = '1';


/* UPDATE NOMBRE AND EDAD */
UPDATE `nodejs` SET `nombre`='Juan Valhala', `edad`='10' WHERE id = '1';
/* UPDATE ID */
UPDATE `nodejs` SET `id`='10' WHERE id = '1';
/* UPDATE NOMBRE */
UPDATE `nodejs` SET `nombre`='Juan Valhala' WHERE id = '1';
/* UPDATE EDAD */
UPDATE `nodejs` SET `edad`='15' WHERE id = '1';