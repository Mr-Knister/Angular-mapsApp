import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl'

interface MarkerAndColor {
  color: string;
  marker: Marker
}

interface PlainMarker {
  color: string;
  lngLat: number[]
}

@Component({
  selector: 'maps-markers-page',
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?:ElementRef;

  public markers:MarkerAndColor[] = [];

  public map?:Map;
  public currentLngLat:LngLat = new LngLat(-70.22368397272307, -18.003433531721413);
  // public divMap?:ElementRef;

  ngAfterViewInit(): void {
    if (!this.divMap) throw 'El elemento HTML no fue encontrado';
    // if (!this.divMap) return;
    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 13, // starting zoom
    });

    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Cesar Deivy Gomez Maquera';

    // const marker = new Marker({
    //   color: 'yellow',
    //   // element: markerHtml
    // })
    //   .setLngLat(this.currentLngLat)
    //   .addTo(this.map!);


    this.readFromLocalStorage();
  }
  ngOnDestroy(): void {
    this.map!.remove();
  }

  createMarker():void {
    if (!this.map) return;
    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();
    this.addMarker(lngLat, color);
  }

  addMarker(lngLat:LngLat, color:string):void {
    if (!this.map) return;
    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map)

    this.markers.push({
      color: color,
      marker: marker
    });
    this.saveToLocalStorage();

    marker.on('dragend', (asd) => {
      this.saveToLocalStorage();
    });
  }

  deleteMarker(index:number):void {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  flyTo(marker:Marker):void {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    });
  }


  saveToLocalStorage():void {
    const plainMarkers:PlainMarker[] = this.markers.map(({color, marker}) => {
      return {
        color: color,
        lngLat: marker.getLngLat().toArray()
      }
    })
    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  readFromLocalStorage():void {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '';
    const plainMarkers:PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach(({color, lngLat}) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat)
      this.addMarker(coords, color);
    })
  }

}
