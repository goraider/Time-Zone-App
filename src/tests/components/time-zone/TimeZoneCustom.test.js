import React from 'react';
import { shallow, mount } from 'enzyme';
import { TimeZoneCustom } from '../../../components/time-zone/TimeZoneCustom';

describe('Renderizando el componente TimeZoneCustom', () => {

      
    test('Carga el Render del Componente', () => { 

        const wrapper =  shallow(<TimeZoneCustom />);
        expect( wrapper ).toMatchSnapshot();

    });

    test('Cargar la cabecera del componente sin Fallar ', () => {

        const wrapper =   shallow(<TimeZoneCustom />);
        const header = (<h1>WorldtimeLite</h1>);
        expect(wrapper.contains(header)).toBe(true);
    
    });

    
    test('Prueba input Autocomplet que este vacio al iniciar', () => {
        
        const wrapper = mount(<TimeZoneCustom />)
        expect(wrapper.find('#world-timezone-autocomplete').get(0).props.value).toEqual("");

    })
    

})