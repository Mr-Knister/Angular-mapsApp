import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl'

@Component({
  selector: 'maps-zoom-range-page',
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?:ElementRef;
  public zoom:number = 16;
  public map?:Map;
  public currentLngLat:LngLat = new LngLat(-70.22368397272307, -18.003433531721413);

  ngAfterViewInit(): void {
    if (!this.divMap) throw new Error('El elemento HTML no fue encontrado.');

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });
    this.mapListeners();
  }
  ngOnDestroy(): void {
    this.map!.remove();
  }

  mapListeners():void {
    if (!this.map) throw 'Mapa no inicializado';
    this.map.on('zoom', () => {
      this.zoom = this.map!.getZoom();
    })
    this.map.on('zoomend', () => {
      if (this.map!.getZoom() < 16) return;
      this.map!.zoomTo(16);
    });
    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
      const {lng, lat} = this.currentLngLat;
      console.log({lng, lat});
    });
  }


  zoomIn():void {
    this.map?.zoomIn();
  }

  zoomOut():void {
    this.map?.zoomOut();
  }

  zoomChanged(value:string):void {
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }

}
