CREATE TABLE resultados.link_imagenes (
	id BIGINT auto_increment NOT NULL PRIMARY KEY,
	cedula BIGINT NOT NULL,
	url VARCHAR(512) NOT NULL,
	CONSTRAINT link_imagenes_unique_cedula UNIQUE KEY (cedula)
)
ENGINE=MyISAM;
