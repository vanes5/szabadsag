import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Data } from './data.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  #Data:Data[] = [];

  @Get()
  @Render('index')
  getHello() {
    return {
      data:{},
      errors:[]
    };
  }

  @Post("bekuldve")
  bekuldve(@Body() data:Data, @Res() res:Response){
    let errors = [];
    let datMegfelelo = true;

    console.log(data)

    if(!data.nev || !data.kezdDatum || !data.indoklas || !data.vegDatum || !data.azon){
      errors.push("Minden adatot ki kell tölteni!");
    }
    if(!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(data.kezdDatum) || !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(data.vegDatum)){
      errors.push("Nem megfelelő formátumba adta meg a dátumot!");
      datMegfelelo = false;
    }
    if(datMegfelelo){
      let kezd = new Date(data.kezdDatum);
      let veg = new Date(data.vegDatum)
      if(!(kezd < veg)){
        errors.push("A kezdeti dátumnak előbb kell lennie, mint a vég dárumnak!");
      }
    }
    if(!/^[A-Z]{3}-\d{3}$/.test(data.azon)){
      errors.push("Nem megfelelő az azonosító!");
    }
    if(data.indoklas.length < 30){
      errors.push("Az indoklásnak hosszabbnak kell lennie, mint 30 karakter");
    }

    if (errors.length > 0) {
      res.render('index', {
        data: data,
        errors
      })
      return
    }

    const Bekuldes: Data={
      nev: data.nev,
      kezdDatum : data.kezdDatum,
      vegDatum: data.vegDatum,
      fizetett: data.fizetett,
      azon: data.azon,
      indoklas: data.indoklas
    }
    this.#Data.push(Bekuldes);
    return res.redirect('/success');
  }

  @Get("/success")
  @Render("success")
  siker(){
    return;
  }
}
