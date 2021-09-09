import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// From https://stackoverflow.com/a/52569928

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(list: any, searchText: string): any[] {
    // @ts-ignore
    String.prototype.replaceAll = function(_find, _replace, _ignoreCase){

      const original = this.toString();
      let result = '';
      let substring = original;
      let substringPosition = 0;
      let substringEnd = -1;
      if(_ignoreCase){ _find = _find.toLowerCase(); substring = original.toLowerCase(); }

      while((substringEnd=substring.indexOf(_find)) > -1)
      {
        result += original.substring(substringPosition, substringPosition+substringEnd) + _replace;
        substring = substring.substring(substringEnd+_find.length, substring.length);
        substringPosition += substringEnd+_find.length;
      }

      // Add Leftover
      if(substring.length>0){ result+=original.substring(original.length-substring.length, original.length); }

      // Return New String
      return result;
    };
//
    if (!list) { return []; }
    if (!searchText) { return list; }

    const value = list.replaceAll(
      searchText, `<span style="color: #0E9976">${searchText}</span>`, true);
    console.log('value', value);

    // @ts-ignore
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
