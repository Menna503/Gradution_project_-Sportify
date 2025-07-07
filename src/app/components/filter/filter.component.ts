import { CommonModule } from '@angular/common';
import { Component, Input ,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
    isHidden: boolean = true;
  hideBrand: boolean = true;
  hideBrice: boolean = false;
  selectedButton: string = 'price';
  brand: string = '';
  sort: string='';
  selectedIndex: number | null = null; 
  priceindex:number|null=null;
  @Input() infoBrand:any; 
  @Output() filterChanged = new EventEmitter<{ sort: string; brand: string }>();
  constructor(){console.log(this.infoBrand)}
  toggelFilter() {
    this.isHidden = !this.isHidden;
  }
  brandChecked(index: number, brand: string) {
    this.selectedIndex = this.selectedIndex =index;
    this.brand = brand;
    this.filterChanged.emit({ sort: this.sort, brand: this.brand }); // Emit event
  }
  
  priceChecked(index: number, sort: string) {
    this.priceindex = this.priceindex =index;
    this.sort = sort === 'hight' ? '-price' : 'price';
    this.filterChanged.emit({ sort: this.sort, brand: this.brand }); // Emit event
  }
  
  show(text: string) {
    this.selectedButton = text;
    this.hideBrand = text !== 'brand';
    this.hideBrice = text !== 'price';
  } 
  
  resetFilters() {
  // رجع كل المتغيرات لقيمتها الأساسية
  this.selectedIndex = null;
  this.priceindex = null;
  this.brand = '';
  this.sort = '';
  this.selectedButton = 'price';
  this.hideBrand = true;
  this.hideBrice = false;

  // Emit reset filters للقومبوننت الأب
  this.filterChanged.emit({ sort: '', brand: '' });
}

}