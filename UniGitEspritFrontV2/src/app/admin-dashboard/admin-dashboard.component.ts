import { Component, type OnInit } from "@angular/core"
import {  FormBuilder, type FormGroup, Validators } from "@angular/forms"

interface User {
  email: string
  username: string
  password: string
  role: string
  firstName: string
  lastName: string
}

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  userForm!: FormGroup
  showPassword = false
  isSubmitting = false

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      nom: ["", [Validators.required]],
      prenom: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      role: ["", [Validators.required]],
      classe: [""],
      specialite: [""],
      identifiant: ["", [Validators.required, Validators.pattern(/^\d{3}[A-Z]{3}\d{4}$/)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onRoleChange(): void {
    const role = this.userForm.get("role")?.value
    const classeControl = this.userForm.get("classe")
    const specialiteControl = this.userForm.get("specialite")

    if (role === "student") {
      classeControl?.setValidators([Validators.required])
      specialiteControl?.setValidators([Validators.required])
    } else {
      classeControl?.clearValidators()
      specialiteControl?.clearValidators()
      classeControl?.setValue("")
      specialiteControl?.setValue("")
    }

    classeControl?.updateValueAndValidity()
    specialiteControl?.updateValueAndValidity()
  }

  formatIdentifiant(event: any): void {
    let value = event.target.value.replace(/[^0-9A-Za-z]/g, "")

    // Convert letters to uppercase
    value = value.toUpperCase()

    // Format: 3 digits + 3 letters + 4 digits
    if (value.length > 3 && value.length <= 6) {
      // Ensure first 3 are digits and next are letters
      const digits = value.substring(0, 3).replace(/[^0-9]/g, "")
      const letters = value.substring(3).replace(/[^A-Z]/g, "")
      value = digits + letters
    } else if (value.length > 6) {
      // Ensure format: 3 digits + 3 letters + 4 digits
      const digits1 = value.substring(0, 3).replace(/[^0-9]/g, "")
      const letters = value.substring(3, 6).replace(/[^A-Z]/g, "")
      const digits2 = value.substring(6, 10).replace(/[^0-9]/g, "")
      value = digits1 + letters + digits2
    }

    event.target.value = value
    this.userForm.get("identifiant")?.setValue(value)
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true

      const userData = this.userForm.value
      console.log("Données utilisateur:", userData)

      // Simuler l'ajout d'utilisateur
      setTimeout(() => {
        this.isSubmitting = false
        // Ici vous pouvez ajouter la logique pour envoyer les données au serveur
        alert("Utilisateur ajouté avec succès!")
        this.userForm.reset()
      }, 2000)
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.get(key)?.markAsTouched()
      })
    }
  }

  goBack(): void {
    // Logique pour retourner à la page précédente
    window.history.back()
  }
}
