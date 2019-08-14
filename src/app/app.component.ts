import { Component, OnInit } from '@angular/core';
import { ConfigService } from './api.service';
import { People } from './api.models';
import * as CanvasJS from '../assets/canvasjs.min';

@Component({
  selector: 'abe-root',
  templateUrl: './app.component.html',
  providers: [ConfigService],
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'dashboard';
  displayedColumns: string[] = ['name', 'height', 'mass', 'hair_color', 'birth_year', 'homeworld', 'films'];
  dataSource: People[] = [];
  id: string;
  planet_name: string;
  people: People[] = [];

  constructor(private configService: ConfigService) { }

  async ngOnInit() {
    await this.initiateChart();
    await this.initiateTable();

  }

  initiateChart() {
    CanvasJS.addColorSet("graphColors",
      ["rgb(16, 150, 24)",
        "rgb(153, 0, 153)",
        "rgb(51, 102, 204)",
        "rgb(220, 57, 18)",
        "rgb(255, 153, 0)"
      ]);
    let chart = new CanvasJS.Chart("chartContainer", {
      colorSet: "graphColors",
      animationEnabled: true,
      exportEnabled: false,
      title: {
        text: "5 maiores bilheterias Star Wars",
        fontSize: "18",
        position: 'left',
        padding: 5,
      },
      data: [{
        type: "pie",
        showInLegend: false,
        toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
        indexLabel: "{name} - #percent%",

        dataPoints: [
          { y: 40, name: "Star Wars IV" },
          { y: 30, name: "Star Wars Rogue One" },
          { y: 10, name: "Star Wars I" },
          { y: 10, name: "Star Wars II" },
          { y: 10, name: "Star Wars III" },
        ]
      }]
    });

    chart.render();
  }

  initiateTable() {
    this.configService.getPeople().subscribe(
      personList => {
        this.people = personList
        this.makeTable(this.people);
      }
    );
  }

  makeTable(pp: People[]) {
    for (let index = 0; index < pp.length; index++) {
      this.id = this.getPlanetID(pp[index].homeworld);
      this.configService.getPlanet(this.id)
        .subscribe(get_planet_name => {
          this.planet_name = get_planet_name.name
          pp[index].homeworld = pp[index].homeworld.replace(
            pp[index].homeworld, this.planet_name)
        });
    }
    this.updateData(pp)
  }

  getPlanetID(planet: string): string {
    return this.id = planet.replace(/\D/g, ''); 
  }

  updateData(products: any): void {
    this.dataSource = products.slice(0, 4);
  }

  applyFilter(filterValue: string) {
    if (filterValue !== "" || filterValue !== null) {
      this.configService.searchPeople(filterValue).subscribe(personList => {
        this.people = personList
        this.makeTable(this.people);
      });
    }
  }
}





