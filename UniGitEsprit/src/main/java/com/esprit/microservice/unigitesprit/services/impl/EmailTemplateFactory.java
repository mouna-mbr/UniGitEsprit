package com.esprit.microservice.unigitesprit.services.impl;

import java.time.LocalDate;

public class EmailTemplateFactory {
    public static String ajoutMembre(String userName, String groupName) {
        return """
        <div style='font-family: Arial,sans-serif;'>
          <h2 style='color:#1976d2;'>Ajout au groupe</h2>
          <p>Bonjour %s,</p>
          <p>Vous avez été ajouté au groupe <b>%s</b>.</p>
          <p>Bienvenue dans l’équipe 🎉</p>
        </div>
        """.formatted(userName, groupName);
    }

    public static String sprintDeadline(String userName, String sprintName, LocalDate deadline) {
        return """
        <div style='font-family: Arial,sans-serif;'>
          <h2 style='color:#d32f2f;'>Deadline proche</h2>
          <p>Bonjour %s,</p>
          <p>Le sprint <b>%s</b> se termine le <b>%s</b>.</p>
          <p>Pensez à finaliser vos tâches à temps ⏳</p>
        </div>
        """.formatted(userName, sprintName, deadline);
    }

    public static String demandeBDP(String userName) {
        return """
        <div style='font-family: Arial,sans-serif;'>
          <h2 style='color:#388e3c;'>Nouvelle Demande BDP</h2>
          <p>Une nouvelle demande BDP a été créée par <b>%s</b>.</p>
          <p>Veuillez consulter la plateforme pour plus de détails.</p>
        </div>
        """.formatted(userName);
    }

    public static String demandeParrainage(String userName) {
        return """
        <div style='font-family: Arial,sans-serif;'>
          <h2 style='color:#388e3c;'>Nouvelle Demande de Parrainage</h2>
          <p>Bonjour,</p>
          <p>Une demande de parrainage a été soumise par <b>%s</b>.</p>
          <p>Consultez la plateforme pour valider ou refuser.</p>
        </div>
        """.formatted(userName);
    }

    public static String nouveauSujet(String userName, String sujetTitle) {
        return """
        <div style='font-family: Arial,sans-serif;'>
          <h2 style='color:#1976d2;'>Nouveau sujet disponible</h2>
          <p>Bonjour %s,</p>
          <p>Un nouveau sujet a été ajouté : <b>%s</b>.</p>
          <p>Connectez-vous à la plateforme pour en savoir plus.</p>
        </div>
        """.formatted(userName, sujetTitle);
    }

    public static String changementStatut(String userName, String demandeTitle, String oldStatus, String newStatus) {
        return """
        <div style='font-family: Arial,sans-serif;'>
          <h2 style='color:#f57c00;'>Mise à jour de votre demande</h2>
          <p>Bonjour %s,</p>
          <p>Le statut de votre demande <b>%s</b> a changé :</p>
          <p><b>Ancien statut :</b> %s<br/>
             <b>Nouveau statut :</b> %s</p>
          <p>Merci de vérifier votre espace personnel.</p>
        </div>
        """.formatted(userName, demandeTitle, oldStatus, newStatus);
    }
}
