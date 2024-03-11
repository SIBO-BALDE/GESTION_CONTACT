import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Users } from './users';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {
  contactUsers: Users[] = [];

  // Formes des objets du tableau 
  // {
  //   idUser:"" ,
  //   nom:"",
  //   prenom:"",
  //   email:"",
  //   password:"",
  //   telephone:"",
  //   photo:"",
  //   contacts:[],
  // },

  //les element à mettre dans le tableau contacts
  // let contactUser{
  //   idContact:1,
  //   nom:"",
  //   prenom:"",
  //   email:"",
  //   photo:"",
  //   telephone:"",
  //   etat:"",
  //   cratedAt:"",
  //   createdBy:"",
  //   updatedAt:"",
  //   updatedBy:"",
  //   description:"",
  // }



  // attributs
  email: string = "";
  password: string = "";
  prenom: string = "";
  nom: string = "";
  telephone: string = "";
  passwordConf: string = "";
  photoURL: string = "";

  // tableaux
  tabUsers: any;
  currentUser: any;


  // choix pour afficher un formulaire 
  choice: boolean = true;

  found: boolean = false;

  // Le constructeur 
  constructor(private route: Router) { }


  // Methode d'initialisation 
  ngOnInit() {
    if (!localStorage.getItem("contactUsers")) {
      localStorage.setItem("contactUsers", JSON.stringify(this.contactUsers));
    }

    this.tabUsers = JSON.parse(localStorage.getItem("contactUsers") || '[]');
  }


  // Fonction pour afficher un sweetalert 
  verifInfos(title: any, text: any, icon: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    })
  }

  // Methode pour uploader le fichier image 
  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      const selectedFile = fileList[0];
      if (selectedFile) {
        // Vérification du type de fichier (image)
        if (selectedFile.type.match('image.*')) {
          // Crée un objet URL pour afficher un aperçu de l'image
          this.photoURL = URL.createObjectURL(selectedFile);
        }
      }
    }
  }

  // Methode pour se connecter 
  login() {
    //  On verifie si les champs contiennent de l'information 
    if (this.email == "" || this.password == "") {
      this.verifInfos("Erreur!", "Veuillez remplir les champs", "error");
    }
    else if (this.tabUsers.length == 0) {
      this.verifInfos("Erreur!", "Ce compte n'existe pas", "error");
    }
    else {
      this.currentUser = this.tabUsers.find((element: any) => (element.email == this.email && element.password == this.password))
      if (this.currentUser) {
        this.verifInfos("Cool!", "Bienvenu dans votre espace de travail ", "success");
        this.route.navigate(['/contact', this.currentUser.idUser]);
      }
      else {
        this.verifInfos("Erreur!", "Ce compte n'existe pas", "error");
      }
    }
  }



  // Methode pour avoir un compte 
  register() {

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (this.nom == "" || this.prenom == "" || this.email == "" || this.password == "" || this.telephone == "") {
      this.verifInfos("Erreur!", "Veuillez remplir les champs", "error");
    }

    else if (!this.email.match(emailPattern)) {
      this.verifInfos("Erreur!", "Email invalide", "error");
    }

    else if (this.password.length < 8) {
      this.verifInfos("Erreur!", "Mot de passe doit être supérieur ou égal à 8", "error");
    }

    else if (this.password != this.passwordConf) {
      this.verifInfos('Erreur!', 'Les deux mots de passe ne sont pas conforme', 'error');
    }
    else {
      // Si toutes les vérifications sont valdes on crée le compte
      let compteUser = {
        idUser: this.tabUsers.length + 1,
        etat: 1,
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        password: this.password,
        telephone: this.telephone,
        photo: this.photoURL,
        contacts: [],
      }

      let userExist = this.tabUsers.find((element: any) => element.email == this.email);
      console.log(userExist);
      if (userExist) {
        this.verifInfos('Impossible!', 'Ce compte existe déjà', 'error');
      }

      else {
        this.tabUsers.push(compteUser);
        console.log(this.tabUsers);

        localStorage.setItem("contactUsers", JSON.stringify(this.tabUsers));


        this.verifInfos("Merci", "Compte créé avec succes", "success");
        this.viderChamps();

        this.formChoice();

      }

    }

  }

  viderChamps() {
    this.nom = "";
    this.prenom = "";
    this.telephone = "";
    this.email = "";
    this.password = "";
    this.passwordConf = "";
    this.photoURL = "";
  }


  // Methode pour choisir le formulaire
  formChoice() {
    this.email = "";
    this.password = "";
    this.choice = !this.choice;
  }

}
