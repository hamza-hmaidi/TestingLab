import { HttpClient, HttpHandler } from '@angular/common/http';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Personne } from 'src/app/Model/Personne';
import { DetailCvComponent } from '../detail-cv/detail-cv.component';
import { EmbaucheComponent } from '../embauche/embauche.component';
import { ListeCvComponent } from '../liste-cv/liste-cv.component';

import { CvComponent } from './cv.component';
import { CvService } from '../cv.service';
import { of } from 'rxjs';

fdescribe('CvComponent', () => {
  let component: CvComponent;
  let fixture: ComponentFixture<CvComponent>;
  let debugElement: DebugElement;
  let personne = new Personne(1, 'sellaouti', 'aymen', 36, 'as.jpg', 11111111,  'Assistant Professor' );
  let fakeCvService: Pick<CvService, 'getPersonnes'|'getFakePersonnes'>;
  let fakePersonnes: Personne[] = [
    new Personne(1, 'sellaouti', 'aymen', 36, 'as.jpg', 11111111,  'Assistant Professor' ),
    new Personne(2, 'zidan', 'zineddine', 42, 'zizou.jpeg', 22222222,  'Football Player / Coach' ),
  ];

  beforeEach(async(() => {
    //of returns an observable
    fakeCvService={
      getPersonnes: jasmine.createSpy('getPersonnes').and.returnValue(of(fakePersonnes)),
      getFakePersonnes: jasmine.createSpy('getFakePersonnes').and.returnValue(of(fakePersonnes))
    }
    TestBed.configureTestingModule({
      declarations: [ CvComponent ],
      providers:[HttpClient,HttpHandler,
        {provide:CvService, useValue:fakeCvService}],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
   
    fixture = TestBed.createComponent(CvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it("renders cv list",()=>{
    const cvListElement = findComponent(fixture,'app-liste-cv');
    expect(cvListElement).toBeTruthy();
  })

  it("passes personnes for cvList",()=>{
    //component.personnes = [personne];
    const cvListElement = findComponent(fixture,'app-liste-cv');
    expect(cvListElement.properties.personnes).toBe(component.personnes);
  })
  // it("should initilize personne list on succeeded connection",()=>{

  // })
  //it("should intialize list personne with fake data on error") 
  it('should select personne',()=>{
    component.selectPersonne(personne);
    expect(component.selectedPersonne).toEqual(personne);
  })
  fit('listen for selectedPersonne event',()=>{
    const cvList = findComponent(fixture,'app-liste-cv');
    cvList.triggerEventHandler('selectedPersonne',personne);
    expect(component.selectedPersonne).toEqual(personne);
  })

  it('should render detail cv when slected personne',()=>{
    component.selectPersonne(personne);
    fixture.detectChanges();
    const detailCv = findComponent(fixture,'app-detail-cv');
    expect(detailCv).toBeTruthy();
  })

  it('shouldn\'t render detail cv when no personne is slected',()=>{
    fixture.detectChanges();
    const detailCv = findComponent(fixture,'app-detail-cv');
    expect(detailCv).toBe(null);
  })

  it('should render embauche component',()=>{
    const embauche = findComponent(fixture,'app-embauche');
    expect(embauche).toBeTruthy();
  })

  fit("shoul'd set personnes on init",()=>{
    expect(component.personnes).toEqual(fakePersonnes);
    expect(fakeCvService.getPersonnes).toHaveBeenCalled();
  })
  fit("shoul'd set fake personnes on init when error",()=>{
   // spyOn(fakeCvService,'getPersonnes').and.throwError;
    
    //expect(component.personnes).toEqual(fakePersonnes);
    expect(alert).toHaveBeenCalled();
  })
  
});



function findComponent<T> ( fixture: ComponentFixture<T>,  selector: string,): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}
