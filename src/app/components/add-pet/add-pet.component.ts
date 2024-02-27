import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { Animal } from 'src/app/models/animal/animal';
import { AnimalsService } from 'src/app/services/Animals/animals.service';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.component.html',
  providers: [DatePipe],
  styleUrls: ['./add-pet.component.css']
})
export class AddPetComponent {

  id: string='';
  name: string = '';
  type: string = '';
  mainImage: string = "";
  carouselImages: String[] = [];
  biography: string[] = [];
  sex: string = '';
  birthdate: string = '';
  age: number = 0;
  chip: string = '';
  vaccines: string[] = [];
  diseases: string[] = [];
  observations: string[] = [];


  //variables auxiliares
  biographyString = "";
  vaccinesString = "";
  diseasesString = "";
  observationsString = "";

  //variables control url
  addingAnimal: boolean = false;
  editingAnimal: boolean = false



  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _animalService: AnimalsService,
    private _router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      const url = event['url'];

      if (url === '/addAnimal') {
        this.addingAnimal = true;
        this.editingAnimal = false;
      } else {
        this.editingAnimal = true;
        this.addingAnimal = false;
        this.route.params.subscribe(params => {
          if (url === `/editAnimal/${params['name']}`) {
            const name = params['name'];
            const animal = this._animalService.getAnimalByName(name) || null;
            if (animal) this.loadAnimal(animal);
          }

        });
      }

    });
  }

  calculateAge() {
    if (this.birthdate) {
      const currentDate = new Date();
      const birthdate = new Date(this.birthdate);
      const difference = currentDate.getTime() - birthdate.getTime();
      this.age = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
    }
  }

  createAnimal() {

    this.convertStringsIntoArrays();
    if(this.type=="") this.type="Cat";
    if(this.sex=="") this.sex="Male";
    if(this.birthdate=="") this.birthdate=new Date().toLocaleDateString();
    if(this.chip=="") this.chip="Yes";
    
    
    const animal: Animal = {
      name: this.name,
      type: this.type,
      main_image: this.mainImage,
      carousel_imgs: this.carouselImages,
      biography: this.biography,
      sex: this.sex,
      birthdate: this.birthdate,
      age: this.age,
      chip: this.chip,
      vaccines: this.vaccines,
      diseases: this.diseases,
      observations: this.observations,
      id: this.generarStringAleatorio()
    };
    
    let isCreated = this._animalService.addAnimal(animal);
    if(isCreated) this._router.navigate([animal.type.toLowerCase()+'s']); else this._router.navigate(['/https://www.youtube.com/watch?v=QT0D3MtRjm8']);


  }

  generarStringAleatorio(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < 10; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return resultado;
  }

  convertStringsIntoArrays() {
    this.biography = this.biographyString.split('\n').filter(Boolean);
    this.vaccines = this.vaccinesString.split('\n').filter(Boolean);
    this.diseases = this.diseasesString.split('\n').filter(Boolean);
    this.observations = this.observationsString.split('\n').filter(Boolean);
  }


  onCarouselImagesChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const reader = new FileReader();
        reader.onload = () => {
          this.carouselImages.push(reader.result as string);
          this.changeDetectorRef.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onMainImageChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  loadAnimal(animal: Animal) {

    if(animal.type=='Cat') this.type='Cat'; else this.type='Dog';
    if(animal.sex=='Male') this.sex='Male'; else this.sex='Female';
    if(animal.chip=='Yes') this.chip='Yes'; else this.chip='No';



    this.id = animal.id;
    this.name = animal.name;
    this.age = animal.age;
    this.birthdate = animal.birthdate ? this.datePipe.transform(animal.birthdate, 'yyyy-MM-dd') as string : '';
    this.mainImage = animal.main_image;
    this.carouselImages = animal.carousel_imgs;
    this.biographyString = animal.biography.join('\n');
    this.vaccinesString = animal.vaccines.join('\n');
    this.diseasesString = animal.diseases.join('\n');
    this.observationsString = animal.observations.join('\n');
  }

  editAnimal() {

    this.convertStringsIntoArrays();
    
    let updatedAnimalData: Animal = {
      "id": this.id,
      "name": this.name,
      "type": this.type,
      "main_image": this.mainImage,
      "carousel_imgs": this.carouselImages,
      "biography": this.biography,
      "sex": this.sex,
      "birthdate": this.birthdate.toLocaleString(),
      "age": this.age,
      "chip": this.chip,
      "vaccines": this.vaccines,
      "diseases": this.diseases,
      "observations": this.observations
    };

    console.log(this.id);

    let isEdited = this._animalService.editAnimal(updatedAnimalData);
    if(isEdited) this._router.navigate(['/'+updatedAnimalData.type.toLowerCase()+'s']); else this._router.navigate(['/https://www.youtube.com/watch?v=QT0D3MtRjm8']);


  }

}










