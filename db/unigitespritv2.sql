-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 02 nov. 2025 à 16:46
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `unigitespritv2`
--

-- --------------------------------------------------------

--
-- Structure de la table `classe`
--

CREATE TABLE `classe` (
  `id` bigint(20) NOT NULL,
  `annee_universitaire` varchar(255) NOT NULL,
  `favori` bit(1) NOT NULL,
  `level` enum('L1','L2','L3A','L3B','L4','L5','M1','M2') NOT NULL,
  `nom` varchar(255) NOT NULL,
  `option_formation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `classe`
--

INSERT INTO `classe` (`id`, `annee_universitaire`, `favori`, `level`, `nom`, `option_formation`) VALUES
(2, '2024/2025', b'0', 'L3B', 'twin3', 'DS'),
(3, '2024/2025', b'0', 'L3A', 'twin2', 'DS'),
(4, '2024/2025', b'0', 'L4', 'twin4', 'DS'),
(5, '2023/2024', b'0', 'L1', 'ebank', 'dd'),
(6, '2023/2024', b'0', 'L2', 'hhhhhhhhhh', 'dd'),
(7, '2025/2026', b'1', 'L3B', 'mounaop', 'twinn'),
(8, '2025/2026', b'0', 'L5', 'Smithmoo', 'twin');

-- --------------------------------------------------------

--
-- Structure de la table `classe_enseignant`
--

CREATE TABLE `classe_enseignant` (
  `classe_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `classe_enseignant`
--

INSERT INTO `classe_enseignant` (`classe_id`, `user_id`) VALUES
(7, 578),
(8, 578);

-- --------------------------------------------------------

--
-- Structure de la table `classe_etudiant`
--

CREATE TABLE `classe_etudiant` (
  `classe_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `classe_etudiant`
--

INSERT INTO `classe_etudiant` (`classe_id`, `user_id`) VALUES
(7, 577),
(8, 577),
(8, 581),
(8, 582);

-- --------------------------------------------------------

--
-- Structure de la table `classe_teacher`
--

CREATE TABLE `classe_teacher` (
  `classe_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `classe_user`
--

CREATE TABLE `classe_user` (
  `id` bigint(20) NOT NULL,
  `classe_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `demandebdp`
--

CREATE TABLE `demandebdp` (
  `id` bigint(20) NOT NULL,
  `status` enum('ACCEPTED','PENDING','REFUSED') DEFAULT NULL,
  `group_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `demandebdp`
--

INSERT INTO `demandebdp` (`id`, `status`, `group_id`, `user_id`) VALUES
(136, 'PENDING', 21, 579);

-- --------------------------------------------------------

--
-- Structure de la table `demande_parainage`
--

CREATE TABLE `demande_parainage` (
  `id` bigint(20) NOT NULL,
  `status` enum('ACCEPTED','PENDING','REFUSED') DEFAULT NULL,
  `entreprise_id` bigint(20) DEFAULT NULL,
  `sujet_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `demande_parainage`
--

INSERT INTO `demande_parainage` (`id`, `status`, `entreprise_id`, `sujet_id`, `user_id`) VALUES
(1248, 'PENDING', 3, 8, 587),
(1249, 'PENDING', 3, 8, 587),
(1250, 'PENDING', 3, 9, 587);

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

CREATE TABLE `entreprises` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `entreprises`
--

INSERT INTO `entreprises` (`id`, `address`, `email`, `name`, `phone_number`) VALUES
(1, 'ssss sxz', 'zzxzz@jjj.tn', 'sagem', '23456789'),
(3, 'ddd', 'zz', 'abcBank', '12345678');

-- --------------------------------------------------------

--
-- Structure de la table `etape`
--

CREATE TABLE `etape` (
  `id` bigint(20) NOT NULL,
  `consigne` varchar(255) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `pipeline_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `etape`
--

INSERT INTO `etape` (`id`, `consigne`, `deadline`, `nom`, `pipeline_id`) VALUES
(17, '', '2025-11-02', 'hi', 7),
(18, '', '2025-11-08', 'ddf', 7),
(19, '', '2025-11-02', 'dd', 8),
(20, '', '2025-11-06', 'zz', 8),
(21, 'authentification et gestion role', '2025-11-05', 'sprint 1', 9),
(22, 'gestion des taches et des pipeline', '2025-11-15', 'sprint 2', 9),
(27, '', '2025-11-30', 'sprint3', 9);

-- --------------------------------------------------------

--
-- Structure de la table `favoris`
--

CREATE TABLE `favoris` (
  `id` bigint(20) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `favoris`
--

INSERT INTO `favoris` (`id`, `group_id`, `user_id`) VALUES
(8, 21, 579),
(7, 23, 579);

-- --------------------------------------------------------

--
-- Structure de la table `git_repository`
--

CREATE TABLE `git_repository` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `default_branch` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `forks` int(11) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `github_repo_id` bigint(20) DEFAULT NULL,
  `is_private` bit(1) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `size` bigint(20) DEFAULT NULL,
  `stars` int(11) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `owner_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `group`
--

CREATE TABLE `group` (
  `id` bigint(20) NOT NULL,
  `favori` bit(1) NOT NULL,
  `git_repo_name` varchar(255) DEFAULT NULL,
  `git_repo_url` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `classe_id` bigint(20) DEFAULT NULL,
  `enseignant_id` bigint(20) DEFAULT NULL,
  `sujet_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `group`
--

INSERT INTO `group` (`id`, `favori`, `git_repo_name`, `git_repo_url`, `nom`, `classe_id`, `enseignant_id`, `sujet_id`) VALUES
(21, b'0', 'mouna-repo', 'https://github.com/Benrebahines/mouna-repo', 'mouna', 2, 578, 8),
(22, b'0', 'alinfo-repo', 'https://github.com/Benrebahines/alinfo-repo', 'alinfo', 8, 578, 8),
(23, b'0', 'alinfo2-repo', 'https://github.com/Benrebahines/alinfo2-repo', 'alinfo2', 2, 578, 8),
(24, b'0', 'omar-repo', 'https://github.com/Benrebahines/omar-repo', 'omar', 3, 583, 8),
(25, b'0', 'UniGitEsprit', 'https://github.com/mouna-mbr/UniGitEsprit', 'unigitesprit', 2, 578, 10);

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE `groups` (
  `id` bigint(20) NOT NULL,
  `git_repo_name` varchar(255) DEFAULT NULL,
  `git_repo_url` varchar(255) DEFAULT NULL,
  `is_favori` bit(1) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `classe_id` bigint(20) NOT NULL,
  `enseignant_id` bigint(20) NOT NULL,
  `sujet_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pipeline`
--

CREATE TABLE `pipeline` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `group_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pipeline`
--

INSERT INTO `pipeline` (`id`, `nom`, `group_id`) VALUES
(7, 'validation', 24),
(8, 'ff', 22),
(9, 'validation', 25);

-- --------------------------------------------------------

--
-- Structure de la table `sujets`
--

CREATE TABLE `sujets` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `favori` bit(1) DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `propose_par` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sujets`
--

INSERT INTO `sujets` (`id`, `description`, `favori`, `titre`, `propose_par`) VALUES
(8, 'mouna', b'1', 'mouna', 579),
(9, '', b'0', 'after errors', 583),
(10, 'managment des repo git', b'0', 'git manager', 579),
(11, 'managment des repo git', b'0', 'git manager', 579),
(12, 'managment des repo git', b'0', 'git manager', 579),
(13, 'managment des repo git', b'0', 'git manager', 579),
(14, 'managment des repo git', b'0', 'git manager', 579);

-- --------------------------------------------------------

--
-- Structure de la table `sujet_technologies`
--

CREATE TABLE `sujet_technologies` (
  `sujet_id` bigint(20) NOT NULL,
  `technology` enum('ANGULAR','ANSIBLE','ARGOCD','ASPNET_CORE','AWS','AZURE','BOOTSTRAP','C','CASSANDRA','CHEF','CPLUSPLUS','CSHARP','CSS','DJANGO','DOCKER','ELASTICSEARCH','EXPRESS','FASTAPI','FLASK','GCP','GITHUB_ACTIONS','GITLAB_CI','GO','HTML','JAVA','JAVASCRIPT','JENKINS','KOTLIN','KUBERNETES','LARAVEL','MICRONAUT','MONGODB','MYSQL','NEO4J','NESTJS','NEXTJS','NUXTJS','ORACLE','PHP','POSTGRESQL','PUPPET','PYTHON','QUARKUS','REACT','REDIS','RUBY','RUST','SCALA','SPRING_BOOT','SQLITE','SQLSERVER','SVELTE','SWIFT','TAILWINDCSS','TERRAFORM','TYPESCRIPT','VUE') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sujet_technologies`
--

INSERT INTO `sujet_technologies` (`sujet_id`, `technology`) VALUES
(8, 'JAVA'),
(9, 'CASSANDRA'),
(9, 'JAVA'),
(9, 'TAILWINDCSS'),
(10, 'JAVA'),
(10, 'SPRING_BOOT'),
(11, 'JAVA'),
(11, 'SPRING_BOOT'),
(12, 'JAVA'),
(12, 'SPRING_BOOT'),
(13, 'JAVA'),
(13, 'SPRING_BOOT'),
(14, 'JAVA'),
(14, 'SPRING_BOOT');

-- --------------------------------------------------------

--
-- Structure de la table `tache`
--

CREATE TABLE `tache` (
  `id` bigint(20) NOT NULL,
  `deadline` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `status` enum('DONE','IN_PROGRESS','TO_DO') NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `etape_id` bigint(20) NOT NULL,
  `assignee_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tache`
--

INSERT INTO `tache` (`id`, `deadline`, `description`, `nom`, `status`, `user_id`, `etape_id`, `assignee_id`) VALUES
(6, '2025-11-02', 'ddd', 'ee', 'TO_DO', NULL, 19, 577),
(7, '2025-11-02', 'cc', 'ff', 'IN_PROGRESS', NULL, 19, 577),
(8, '2025-11-02', 'ccc', 'ccc', 'IN_PROGRESS', NULL, 19, 578),
(9, '2025-11-02', 'ddddd', 'ssss', 'DONE', NULL, 19, 578),
(10, '2025-11-02', 'ffff', 'fffff', 'TO_DO', NULL, 19, 578),
(11, '2025-11-02', 'gerer les fonctionnalite selon les roles', 'gestion role', 'DONE', NULL, 19, 578);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `created_at` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL,
  `classe` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `git_access_token` varchar(255) DEFAULT NULL,
  `git_username` varchar(255) DEFAULT NULL,
  `identifiant` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `specialite` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','PROFESSOR','STUDENT') NOT NULL,
  `entreprise_id` bigint(20) DEFAULT NULL,
  `classe_id` bigint(20) DEFAULT NULL,
  `group_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`created_at`, `id`, `classe`, `email`, `first_name`, `git_access_token`, `git_username`, `identifiant`, `last_name`, `password`, `specialite`, `role`, `entreprise_id`, `classe_id`, `group_id`) VALUES
('2025-10-28 15:14:13.000000', 577, 'twin4', 'ali@example.com', 'Ali', NULL, 'aliben', '123ABC4567', 'Ben Salah', '$2a$10$UL.gOS3rKXY1Q9DfPtQrJ.Rcw7.KLGmV.cbbkBQeSNeUW4ymN8EX2', NULL, 'ADMIN', 1, NULL, NULL),
('2025-10-28 15:14:13.000000', 578, 'Smithmoo', 'sara@example.com', 'mouna', NULL, 'sara', '456DEF7890', 'Trabelsi', '$2a$10$mAbIhbqlsYbzfJ/XT6esROq2GgdA4iuHBiBN0y59hE8dJfK2A1mNu', NULL, 'ADMIN', NULL, NULL, NULL),
('2025-10-28 15:14:39.000000', 579, 'twin2', 'iness.ben.rebah@gmail.com', 'ben rebah', NULL, 'bb', '222TTT3333', 'ines', '$2a$10$XsoNEedAEVIk9nffxsfhtOuad93kMKouhdsDH9YS3PWRpeQdDcL/i', NULL, 'ADMIN', NULL, NULL, NULL),
('2025-10-28 17:35:21.000000', 580, 'Smithmoo', 'sonia.ben.rebah@gmail.com', 'ben rebah', NULL, 'inessbougattef-ui', '176AYT3456', 'sonia', '$2a$10$oKtvdidWhSK8jLEwMrj/..X0mkEY7KgYpM1.H4df126e7P0aYVVSu', NULL, 'ADMIN', NULL, NULL, NULL),
('2025-10-28 20:32:42.000000', 581, 'Smithmoo', 'maa.ben.rebah@gmail.com', 'ben rebah', NULL, NULL, '876OIU9876', 'sonia', '$2a$10$XxAdUbq9DjpcLvGQ1N651uLtU76/h0uwMkvr/GmLlLTd1HOgI9Wku', NULL, 'ADMIN', NULL, NULL, NULL),
('2025-10-28 20:49:22.000000', 582, 'Smithmoo', 'omar.ben.rebah@gmail.com', 'ben rebah', NULL, NULL, '564AZE7654', 'omar', '$2a$10$OSaHIpCP2wV8BuO7xMLwFunUwArt.n05aR8LwsiUJ9qO/YcOTV66W', NULL, 'ADMIN', NULL, NULL, NULL),
('2025-10-31 10:02:50.000000', 583, NULL, 'ines@ines.com', 'latifa', NULL, 'inessbougattef-ui', '123TYU1234', 'ben ismail', '$2a$10$E9ECntD0lgOlgM7KwrBCYekqsPVdh9g3texJKioPKXPElI6VhT//q', NULL, 'ADMIN', NULL, NULL, NULL),
('2025-11-01 11:01:34.000000', 587, NULL, 'anis@anis.esprit.tn', 'anis ', NULL, 'inessbougattef-ui', '123REF1233', 'zouaoui', '$2a$10$p4VOtOTbFk9nwGP6BO3e/OyZkaRpfEit7.eNydI5BFvdTy1GuMNFS', NULL, 'ADMIN', 3, NULL, NULL),
('2025-11-01 11:02:22.000000', 589, '', 'bob.williams@example.com', 'Bob', NULL, 'bobwill', '321JKL5678', 'Williams', '$2a$10$K1LjDqYEc/y38DDTo4yNcuNvrJAnUXONLUad6AIGD5UIv9I902sRa', '', 'ADMIN', NULL, NULL, NULL),
('2025-11-01 11:02:22.000000', 590, '5th year', 'emma.brown@example.com', 'Emma', NULL, 'emmab', '654MNO9876', 'Brown', '$2a$10$PBCgv3iQlXLe.kvPltoHCeH00LF8GCOMglsAQJLOEBt7oztUMQ8r6', 'Data Science', 'ADMIN', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_group`
--

CREATE TABLE `user_group` (
  `id` bigint(20) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `group_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_group`
--

INSERT INTO `user_group` (`id`, `role`, `group_id`, `user_id`) VALUES
(50, 'GUEST', 21, 578),
(51, 'GUEST', 21, 578),
(52, 'developer', 22, 583),
(53, 'owner', 22, 577),
(54, 'owner', 22, 578),
(55, 'owner', 23, 581),
(56, 'developer', 24, 579),
(57, 'developer', 24, 578),
(58, 'developer', 24, 579),
(59, 'developer', 24, 578),
(60, 'developer', 25, 578),
(61, 'guest', 25, 581);

-- --------------------------------------------------------

--
-- Structure de la table `user_groups`
--

CREATE TABLE `user_groups` (
  `id` bigint(20) NOT NULL,
  `role` varchar(255) NOT NULL,
  `group_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role` enum('ADMIN','COORDINATEUR_PI','PROFESSOR','REFERENT_ENTREPRISE','REFERENT_ESPRIT','STUDENT') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role`) VALUES
(577, 'STUDENT'),
(578, 'PROFESSOR'),
(578, 'REFERENT_ESPRIT'),
(578, 'STUDENT'),
(579, 'ADMIN'),
(580, 'STUDENT'),
(581, 'STUDENT'),
(582, 'STUDENT'),
(583, 'PROFESSOR'),
(587, 'REFERENT_ENTREPRISE'),
(589, 'ADMIN'),
(590, 'STUDENT');

-- --------------------------------------------------------

--
-- Structure de la table `validation`
--

CREATE TABLE `validation` (
  `id` bigint(20) NOT NULL,
  `date_validation` date DEFAULT NULL,
  `note` double DEFAULT NULL,
  `etape_id` bigint(20) NOT NULL,
  `professor_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `validation`
--

INSERT INTO `validation` (`id`, `date_validation`, `note`, `etape_id`, `professor_id`) VALUES
(6, '2025-10-26', 20, 17, NULL),
(7, '2025-11-01', 15, 19, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `validation_remarques`
--

CREATE TABLE `validation_remarques` (
  `validation_id` bigint(20) NOT NULL,
  `remarque` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `validation_remarques`
--

INSERT INTO `validation_remarques` (`validation_id`, `remarque`) VALUES
(6, 'sssssqsdeqefqefqefqefqfeqeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'),
(6, 'dsdqdqsdssssssssssssdqdqfqfqefqfefqfefefqefeqfqefq'),
(7, 'adjust the nav bar color');

-- --------------------------------------------------------

--
-- Structure de la table `validation_users`
--

CREATE TABLE `validation_users` (
  `validation_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `classe`
--
ALTER TABLE `classe`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `classe_enseignant`
--
ALTER TABLE `classe_enseignant`
  ADD PRIMARY KEY (`classe_id`,`user_id`),
  ADD KEY `FKeujgmy04r7aklwixilu39c7k3` (`user_id`);

--
-- Index pour la table `classe_etudiant`
--
ALTER TABLE `classe_etudiant`
  ADD PRIMARY KEY (`classe_id`,`user_id`),
  ADD KEY `FK2ar7yc3s3bm8slmjj86rde5cr` (`user_id`);

--
-- Index pour la table `classe_teacher`
--
ALTER TABLE `classe_teacher`
  ADD PRIMARY KEY (`classe_id`,`user_id`),
  ADD KEY `FKsuf32doih6c5ku9egmryp4nm9` (`user_id`);

--
-- Index pour la table `classe_user`
--
ALTER TABLE `classe_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_classe_user` (`classe_id`,`user_id`),
  ADD KEY `FK_user` (`user_id`);

--
-- Index pour la table `demandebdp`
--
ALTER TABLE `demandebdp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK9sfm72ornntvnbidcbju379kd` (`group_id`),
  ADD KEY `FKk6u5ja6meipc13fbcuxd9epv6` (`user_id`);

--
-- Index pour la table `demande_parainage`
--
ALTER TABLE `demande_parainage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKiaand9uxg1k83rjluonw11sg5` (`entreprise_id`),
  ADD KEY `FK8x2nxlsifcqrmfn1o430s4rus` (`sujet_id`),
  ADD KEY `FKtem71tm3iylq3isfkbs6x879p` (`user_id`);

--
-- Index pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKlkg9255u1rpa5mksunn54avr7` (`name`),
  ADD UNIQUE KEY `UKdidih0bwxh03amb6vj28ek2if` (`email`);

--
-- Index pour la table `etape`
--
ALTER TABLE `etape`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2s1js4log79wvbho7xbc5d7dk` (`pipeline_id`);

--
-- Index pour la table `favoris`
--
ALTER TABLE `favoris`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKpep5uphgdxmt10x1a17i8cwc4` (`user_id`,`group_id`),
  ADD KEY `FK54tlvsro0hkbf8re61mfsjiam` (`group_id`);

--
-- Index pour la table `git_repository`
--
ALTER TABLE `git_repository`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8uvbdbrj2fc7eded3i2v2dibo` (`owner_id`);

--
-- Index pour la table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKscaouc17fff4eqf74ntqku2a8` (`classe_id`),
  ADD KEY `FKeqj58u0qpgpq2squo78ox8fca` (`enseignant_id`),
  ADD KEY `FKi4bvyili51o68xbud0qg40g4q` (`sujet_id`);

--
-- Index pour la table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKgaauy4jjhat7c9q5aclcwfb82` (`classe_id`),
  ADD KEY `FKn2qcgdxfs95g68enlcdbeqblh` (`enseignant_id`),
  ADD KEY `FKmtftsoa1kdgkyr34sle5ham2g` (`sujet_id`);

--
-- Index pour la table `pipeline`
--
ALTER TABLE `pipeline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8niho5cc8o2jncp9y6xbdt6qe` (`group_id`);

--
-- Index pour la table `sujets`
--
ALTER TABLE `sujets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKtr3ohk6alcp48rm51igmjcbyu` (`propose_par`);

--
-- Index pour la table `sujet_technologies`
--
ALTER TABLE `sujet_technologies`
  ADD PRIMARY KEY (`sujet_id`,`technology`);

--
-- Index pour la table `tache`
--
ALTER TABLE `tache`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKs2o3c73mb54o5t8kbo7ltpr6j` (`user_id`),
  ADD KEY `FK7aajhalmuuki8dr8cxro3lqta` (`etape_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UK4glh6r3osmm7gjoi5lf5imxx0` (`identifiant`),
  ADD UNIQUE KEY `UKdeowadrwwdsfbyonnns8cuyai` (`entreprise_id`),
  ADD KEY `FK5boe54ibes5l1swp5nfldhtog` (`classe_id`),
  ADD KEY `FKevbukniirjd1immfaq3jc6c6l` (`group_id`);

--
-- Index pour la table `user_group`
--
ALTER TABLE `user_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7k9ade3lqbo483u9vuryxmm34` (`user_id`),
  ADD KEY `FK71ue7uuqo0neoodkx7smf7e3o` (`group_id`);

--
-- Index pour la table `user_groups`
--
ALTER TABLE `user_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKmrgahbb4w32n9wkjqbipttc87` (`group_id`),
  ADD KEY `FKd37bs5u9hvbwljup24b2hin2b` (`user_id`);

--
-- Index pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role`);

--
-- Index pour la table `validation`
--
ALTER TABLE `validation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKp1w5rkhsy31wgs0jvjq6u564a` (`etape_id`),
  ADD KEY `FKn48duark9q93742dad3kdl9q5` (`professor_id`);

--
-- Index pour la table `validation_remarques`
--
ALTER TABLE `validation_remarques`
  ADD KEY `FK45xbymqdtcq0t301wj0vww9xi` (`validation_id`);

--
-- Index pour la table `validation_users`
--
ALTER TABLE `validation_users`
  ADD KEY `FKsjom6w7hdg0ulk1f40encstgg` (`user_id`),
  ADD KEY `FKmkqsy1xobrhh8fpsu24lcn7gv` (`validation_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `classe`
--
ALTER TABLE `classe`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `classe_user`
--
ALTER TABLE `classe_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `demandebdp`
--
ALTER TABLE `demandebdp`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=137;

--
-- AUTO_INCREMENT pour la table `demande_parainage`
--
ALTER TABLE `demande_parainage`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1251;

--
-- AUTO_INCREMENT pour la table `entreprises`
--
ALTER TABLE `entreprises`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `etape`
--
ALTER TABLE `etape`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `favoris`
--
ALTER TABLE `favoris`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `git_repository`
--
ALTER TABLE `git_repository`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `group`
--
ALTER TABLE `group`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `pipeline`
--
ALTER TABLE `pipeline`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `sujets`
--
ALTER TABLE `sujets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `tache`
--
ALTER TABLE `tache`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=591;

--
-- AUTO_INCREMENT pour la table `user_group`
--
ALTER TABLE `user_group`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT pour la table `user_groups`
--
ALTER TABLE `user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `validation`
--
ALTER TABLE `validation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `classe_enseignant`
--
ALTER TABLE `classe_enseignant`
  ADD CONSTRAINT `FK1k4ixry8vrncg9msivquk5qkv` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`),
  ADD CONSTRAINT `FKeujgmy04r7aklwixilu39c7k3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `classe_etudiant`
--
ALTER TABLE `classe_etudiant`
  ADD CONSTRAINT `FK2ar7yc3s3bm8slmjj86rde5cr` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKilvqvtnsst3509temti97xea1` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`);

--
-- Contraintes pour la table `classe_teacher`
--
ALTER TABLE `classe_teacher`
  ADD CONSTRAINT `FKq9v4hqqicqrbxqgb0fou7g7pn` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`),
  ADD CONSTRAINT `FKsuf32doih6c5ku9egmryp4nm9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `classe_user`
--
ALTER TABLE `classe_user`
  ADD CONSTRAINT `FK_classe` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`),
  ADD CONSTRAINT `FK_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `demandebdp`
--
ALTER TABLE `demandebdp`
  ADD CONSTRAINT `FK9sfm72ornntvnbidcbju379kd` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`),
  ADD CONSTRAINT `FKk6u5ja6meipc13fbcuxd9epv6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `demande_parainage`
--
ALTER TABLE `demande_parainage`
  ADD CONSTRAINT `FK8x2nxlsifcqrmfn1o430s4rus` FOREIGN KEY (`sujet_id`) REFERENCES `sujets` (`id`),
  ADD CONSTRAINT `FKiaand9uxg1k83rjluonw11sg5` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`),
  ADD CONSTRAINT `FKtem71tm3iylq3isfkbs6x879p` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `etape`
--
ALTER TABLE `etape`
  ADD CONSTRAINT `FK2s1js4log79wvbho7xbc5d7dk` FOREIGN KEY (`pipeline_id`) REFERENCES `pipeline` (`id`);

--
-- Contraintes pour la table `favoris`
--
ALTER TABLE `favoris`
  ADD CONSTRAINT `FK2uwgnaadpjc5id02tub45nrfq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK54tlvsro0hkbf8re61mfsjiam` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`);

--
-- Contraintes pour la table `git_repository`
--
ALTER TABLE `git_repository`
  ADD CONSTRAINT `FK8uvbdbrj2fc7eded3i2v2dibo` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `group`
--
ALTER TABLE `group`
  ADD CONSTRAINT `FKeqj58u0qpgpq2squo78ox8fca` FOREIGN KEY (`enseignant_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKi4bvyili51o68xbud0qg40g4q` FOREIGN KEY (`sujet_id`) REFERENCES `sujets` (`id`),
  ADD CONSTRAINT `FKscaouc17fff4eqf74ntqku2a8` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`);

--
-- Contraintes pour la table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `FKgaauy4jjhat7c9q5aclcwfb82` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`),
  ADD CONSTRAINT `FKmtftsoa1kdgkyr34sle5ham2g` FOREIGN KEY (`sujet_id`) REFERENCES `sujets` (`id`),
  ADD CONSTRAINT `FKn2qcgdxfs95g68enlcdbeqblh` FOREIGN KEY (`enseignant_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `pipeline`
--
ALTER TABLE `pipeline`
  ADD CONSTRAINT `FK8niho5cc8o2jncp9y6xbdt6qe` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`);

--
-- Contraintes pour la table `sujets`
--
ALTER TABLE `sujets`
  ADD CONSTRAINT `FKtr3ohk6alcp48rm51igmjcbyu` FOREIGN KEY (`propose_par`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `sujet_technologies`
--
ALTER TABLE `sujet_technologies`
  ADD CONSTRAINT `FKk2v4ldnadqkblcvopr5plhbee` FOREIGN KEY (`sujet_id`) REFERENCES `sujets` (`id`);

--
-- Contraintes pour la table `tache`
--
ALTER TABLE `tache`
  ADD CONSTRAINT `FK7aajhalmuuki8dr8cxro3lqta` FOREIGN KEY (`etape_id`) REFERENCES `etape` (`id`),
  ADD CONSTRAINT `FKs2o3c73mb54o5t8kbo7ltpr6j` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK5boe54ibes5l1swp5nfldhtog` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`),
  ADD CONSTRAINT `FKevbukniirjd1immfaq3jc6c6l` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`),
  ADD CONSTRAINT `FKh5u8h6wbknrxvehsawftqkpxo` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`);

--
-- Contraintes pour la table `user_group`
--
ALTER TABLE `user_group`
  ADD CONSTRAINT `FK71ue7uuqo0neoodkx7smf7e3o` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`),
  ADD CONSTRAINT `FK7k9ade3lqbo483u9vuryxmm34` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `user_groups`
--
ALTER TABLE `user_groups`
  ADD CONSTRAINT `FKd37bs5u9hvbwljup24b2hin2b` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKmrgahbb4w32n9wkjqbipttc87` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`);

--
-- Contraintes pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `validation`
--
ALTER TABLE `validation`
  ADD CONSTRAINT `FKn48duark9q93742dad3kdl9q5` FOREIGN KEY (`professor_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKp1w5rkhsy31wgs0jvjq6u564a` FOREIGN KEY (`etape_id`) REFERENCES `etape` (`id`);

--
-- Contraintes pour la table `validation_remarques`
--
ALTER TABLE `validation_remarques`
  ADD CONSTRAINT `FK45xbymqdtcq0t301wj0vww9xi` FOREIGN KEY (`validation_id`) REFERENCES `validation` (`id`);

--
-- Contraintes pour la table `validation_users`
--
ALTER TABLE `validation_users`
  ADD CONSTRAINT `FKmkqsy1xobrhh8fpsu24lcn7gv` FOREIGN KEY (`validation_id`) REFERENCES `validation` (`id`),
  ADD CONSTRAINT `FKsjom6w7hdg0ulk1f40encstgg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
