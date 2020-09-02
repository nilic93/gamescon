import { Pipe, PipeTransform } from '@angular/core';
import { TitleCasePipe } from "@angular/common";


@Pipe({ name: 'gameFormatDisplay' })
export class GameFormatPipe implements PipeTransform {
  constructor(private titlePipe: TitleCasePipe) {}
  transform(value: string): string {
    if(value ==='lucky13') return 'LUCKY13';
    let game = value.replace('_',' ')
    return this.titlePipe.transform(game);
  }
}
