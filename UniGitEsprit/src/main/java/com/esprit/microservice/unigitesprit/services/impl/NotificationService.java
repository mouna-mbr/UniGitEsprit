package com.esprit.microservice.unigitesprit.services.impl;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class NotificationService {
    @Autowired
    private final EmailService emailService;

    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void notifyAjoutMembre(String email, String userName, String groupName) throws MessagingException {
        emailService.sendHtmlEmail(
                email,
                "Ajout au groupe " + groupName,
                EmailTemplateFactory.ajoutMembre(userName, groupName)
        );
    }

    public void notifySprintDeadline(String email, String userName, String sprintName, LocalDate deadline) throws MessagingException {
        emailService.sendHtmlEmail(
                email,
                "Deadline proche : " + sprintName,
                EmailTemplateFactory.sprintDeadline(userName, sprintName, deadline)
        );
    }

    public void notifyDemandeBDP(String email, String userName) throws MessagingException {
        emailService.sendHtmlEmail(
                email,
                "Nouvelle Demande BDP",
                EmailTemplateFactory.demandeBDP(userName)
        );
    }

    public void notifyDemandeParrainage(String email, String userName) throws MessagingException {
        emailService.sendHtmlEmail(
                email,
                "Nouvelle Demande de Parrainage",
                EmailTemplateFactory.demandeParrainage(userName)
        );
    }

    public void notifyNouveauSujet(String email, String userName, String sujetTitle) throws MessagingException {
        emailService.sendHtmlEmail(
                email,
                "Nouveau sujet : " + sujetTitle,
                EmailTemplateFactory.nouveauSujet(userName, sujetTitle)
        );
    }

    public void notifyChangementStatut(String email, String userName, String demandeTitle, String oldStatus, String newStatus) throws MessagingException {
        emailService.sendHtmlEmail(
                email,
                "Changement de statut de votre demande",
                EmailTemplateFactory.changementStatut(userName, demandeTitle, oldStatus, newStatus)
        );
    }
}
