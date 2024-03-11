import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

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
  email:string="";
  prenom:string="";
  nom:string="";
  telephone:string="";
  description:string="";
  photoURL:string="";


  idContactUser = 0;
  tabUsers: any;
  userFound: any;
  contactsUserFound: any;

  // Contact trouvé  
  contactUserFound: any;

  // choix pour afficher soit la corbeille soit la liste des contacts
  choice : boolean = true;
  found: boolean = false;

  //valeur du filter qui correspond a celui du champs recherche
  filterValue = '';

  //les element trouver
  filteredElement:any;

  // Constructeur de la classe 
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // On essaie de récupérer l'ID qui se trouve dans l'URL
    this.idContactUser = +this.route.snapshot.params['id'];
    // console.log(this.idContactUser)

    this.tabUsers = JSON.parse(localStorage.getItem("contactUsers") || '[]');
    // console.log(this.tabUsers)
    // console.log(this.tabUsers[this.idContactUser-1]);

    this.userFound = this.tabUsers.find((element:any) =>element.idUser == this.idContactUser);
    // this.userFound = this.tabUsers[this.idContactUser-1];
    this.contactsUserFound = this.userFound.contacts;
    console.log(this.contactsUserFound);

    //assigner la liste des contacts a notre variable element filtrer 
    this.filteredElement = this.contactsUserFound;
  }

  //fonction pour filtrer
// filterByTitle(){
//   if (!this.filterValue) {
//     this.filteredElement = this.contactsUserFound;
//   }

//   this.filteredElement = this.contactsUserFound.filter(
//     (elt:any) => (elt?.nomContact.toLowerCase().includes(this.filterValue.toLowerCase())) || elt?.prenomContact.toLowerCase().includes(this.filterValue.toLowerCase())
//   );
// }


  // Methode de recherche automatique 
  onSearch(){
    // Recherche se fait selon le nom ou le prenom 
    this.filteredElement = this.contactsUserFound.filter(
      (elt:any) => (elt?.nomContact.toLowerCase().includes(this.filterValue.toLowerCase())) || elt?.prenomContact.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }


  // Methode pour uploader le fichier image 
  // uploadFile(event: Event) {
  //   const element = event.currentTarget as HTMLInputElement;
  //   let fileList: FileList | null = element.files;
  //   if (fileList) {
  //     const selectedFile = fileList[0];
  //     if (selectedFile) {
  //       if (selectedFile.type.match('image.*')) {
  //           this.photoURL = URL.createObjectURL(selectedFile);
  //       } 
  //     }
  //   }
  // }

  // Methode pour ajouter un contact 
  ajouter() {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (this.nom == "" || this.prenom == "" || this.email == "" || this.description == "" || this.telephone=="" || this.photoURL == "") {
      this.verifInfos("Erreur!", "Veuillez remplir les champs", "error");
    }
    
    else if (!this.email.match(emailPattern)){
      this.verifInfos("Erreur!", "Email invalide", "error");
    }
    
    // Si toutes les vérifications sont valdes on crée le compte
    else {
      // On récupère le dernier element du tableau  
      let contactUser = {
        idContact: this.userFound.contacts.length +1,
        nomContact: this.nom,
        prenomContact: this.prenom,
        emailContact: this.email,
        photoContact: this.photoURL,
        telephoneContact: this.telephone,
        descriptionContact: this.description,
        etatContact:1,
        cratedAt: new Date(),
        createdBy: this.userFound.email,
        updatedAt: "",
        updatedBy: this.userFound.email,
      }

      let emailContactFound = this.userFound.contacts.find((element:any) => element. emailContact == this.email);
      if (emailContactFound){
        this.verifInfos("Impossible", "Ce contact existe déjà", "error")
      }

      else {
        this.userFound.contacts.push(contactUser);
        console.log (this.userFound);

        console.log(this.tabUsers);

        localStorage.setItem("contactUsers",JSON.stringify(this.tabUsers));

        // this.verifInfos("Felicitation", "Contact créé avec succes", "success");
        this.viderChamps();
        // window.location.reload();
        Swal.fire({
          title: "Felicitation!",
          text: "Contact créé avec succes",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }

      
    }
    
  }

  // Fonction pour afficher un sweetalert 
  verifInfos(title: any, text: any, icon: any){
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    })
  }

  // Fonction pour vider les champs 
  viderChamps(){
    this.email="";
    this.prenom="";
    this.nom="";
    this.telephone="";
    this.description="";
    this.photoURL="";
  }

  // Supprimer un contact
  supprimer(idContact: any){
    Swal.fire({
      title: "Voulez vous vraiment supprimer ce contact?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: `Annuler`,
      confirmButtonColor: "#4aa3a2",
      cancelButtonColor: "#F9968B",
      confirmButtonText: "Oui, supprimer!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userFound.contacts[idContact-1].etatContact = 0;
        localStorage.setItem("contactUsers",JSON.stringify(this.tabUsers));
        
        this.verifInfos("Supprimer!", "", "success");
      }
    });

  }


  // Modifier un contact 
  // Charger information 
  chargeInfoModif(contactUserFound:any){
    // L'objet contact trouvé 
    this.contactUserFound = contactUserFound;

    // Chargement des informations 
    this.nom = contactUserFound.nomContact;
    this.prenom = contactUserFound.prenomContact;
    this.email = contactUserFound.emailContact;
    this.telephone = contactUserFound.telephoneContact;
    this.description = contactUserFound.descriptionContact;
    this.photoURL = contactUserFound.photoContact;
  }

  // Modifier un contact 
  modifier(){ 

    console.log("Avant modification");
    console.log(this.contactUserFound);
    
    this.contactUserFound.nomContact = this.nom;
    this.contactUserFound.prenomContact = this.prenom;
    this.contactUserFound.emailContact = this.email;
    this.contactUserFound.photoContact = this.photoURL;
    this.contactUserFound.telephoneContact = this.telephone;
    this.contactUserFound.descriptionContact = this.description;
    this.contactUserFound.updatedAt= new Date();

    console.log("Apres modification");
    console.log(this.contactUserFound);

    localStorage.setItem("contactUsers",JSON.stringify(this.tabUsers));
    // this.verifInfos("Félicitation!", "Contact modifier avec succes", "success");
    // window.location.reload();
    this.viderChamps();

    Swal.fire({
      title: "Felicitation!",
      text: "Contact modifier avec succes",
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }
  
  // Methode pour choisir le formulaire
  listChoice(){
    this.choice = !this.choice;
  }


  // Restaurer le contact 
  restaurer(idContact: any){
    Swal.fire({
      title: "Voulez vous vraiment restaurer ce contact?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: `Annuler`,
      confirmButtonColor: "#4aa3a2",
      cancelButtonColor: "#F9968B",
      confirmButtonText: "Oui, restaurer!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userFound.contacts[idContact-1].etatContact = 1;
        localStorage.setItem("contactUsers",JSON.stringify(this.tabUsers));
        
        this.verifInfos("Restaurer!", "", "success");
      }
    });
  }

  // supprimer définitivement un contact 
  suppressionDefinitive(idContact: any){
    Swal.fire({
      title: "Voulez vous supprimer définitivement ce contact?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: `Annuler`,
      confirmButtonColor: "#4aa3a2",
      cancelButtonColor: "#F9968B",
      confirmButtonText: "Oui, supprimer!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userFound.contacts[idContact-1].etatContact = -1;
        localStorage.setItem("contactUsers",JSON.stringify(this.tabUsers));
        
        this.verifInfos("supprimer definitivement!", "", "success");
      }
    });

    
  }

  // Vider toute la corbeille 
  viderCorbeille(){
    Swal.fire({
      title: "Voulez vous vraiment vider la corbeille?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: `Annuler`,
      confirmButtonColor: "#4aa3a2",
      cancelButtonColor: "#F9968B",
      confirmButtonText: "Oui, vider!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userFound.contacts.forEach((element:any) => {
          if (element.etatContact == 0){
            element.etatContact = -1;
          }
        });
    
        localStorage.setItem("contactUsers",JSON.stringify(this.tabUsers));
        
        this.verifInfos("Corbeille vidée!", "", "success");
      }
    });
  }
}