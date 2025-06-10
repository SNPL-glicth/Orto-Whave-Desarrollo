-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS orto_whave_db;
USE orto_whave_db;

-- Crear tabla de roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar roles básicos
INSERT INTO roles (nombre) VALUES 
    ('administrador'),
    ('doctor'),
    ('paciente');

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Crear tabla de especialidades
CREATE TABLE especialidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Crear tabla de doctores (información específica de doctores)
CREATE TABLE doctores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    especialidad_id INT NOT NULL,
    numero_licencia VARCHAR(50) UNIQUE,
    años_experiencia INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

-- Crear tabla de pacientes (información específica de pacientes)
CREATE TABLE pacientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    genero ENUM('M', 'F', 'Otro'),
    grupo_sanguineo VARCHAR(5),
    alergias TEXT,
    antecedentes_medicos TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Crear tabla de citas
CREATE TABLE citas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    doctor_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    duracion INT DEFAULT 30, -- duración en minutos
    estado ENUM('programada', 'completada', 'cancelada') DEFAULT 'programada',
    motivo TEXT,
    notas TEXT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (doctor_id) REFERENCES doctores(id)
);

-- Crear tabla de historias clínicas
CREATE TABLE historias_clinicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paciente_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- Crear tabla de registros médicos
CREATE TABLE registros_medicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    historia_clinica_id INT NOT NULL,
    doctor_id INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diagnostico TEXT,
    tratamiento TEXT,
    prescripcion TEXT,
    notas TEXT,
    FOREIGN KEY (historia_clinica_id) REFERENCES historias_clinicas(id),
    FOREIGN KEY (doctor_id) REFERENCES doctores(id)
);

-- Insertar especialidad de Ortodoncia
INSERT INTO especialidades (nombre, descripcion) VALUES 
    ('Ortodoncia', 'Especialidad odontológica que estudia, previene y corrige las alteraciones del desarrollo, las formas de las arcadas dentarias y la posición de los maxilares.');

-- Crear usuarios iniciales con contraseñas hasheadas (usando SHA2 por ahora, en producción usar bcrypt)
INSERT INTO usuarios (email, password, nombre, apellido, rol_id) VALUES 
    ('admin@ortowhave.com', SHA2('admin123', 256), 'Administrador', 'Principal', 1),
    ('doctor@ortowhave.com', SHA2('doctor123', 256), 'Doctor', 'Principal', 2),
    ('paciente@ortowhave.com', SHA2('paciente123', 256), 'Paciente', 'Principal', 3);

-- Vincular el doctor con su información específica
INSERT INTO doctores (usuario_id, especialidad_id, numero_licencia, años_experiencia)
SELECT u.id, e.id, 'LIC-001', 5
FROM usuarios u, especialidades e
WHERE u.email = 'doctor@ortowhave.com' AND e.nombre = 'Ortodoncia';

-- Vincular el paciente con su información específica
INSERT INTO pacientes (usuario_id, fecha_nacimiento, genero)
SELECT id, '1990-01-01', 'M'
FROM usuarios
WHERE email = 'paciente@ortowhave.com'; 