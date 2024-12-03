import styled from 'styled-components';

export const Container = (styled as any).View`
    flex: 1;
    padding-top: 80px;
    align-items: center;
    justify-content: center;
    background-color: white;
`;

export const InputWrapper = (styled as any).View`
    flex-direction: row;    
    align-items: center;
    border: 1px solid lightgrey;
    margin-left: 40px;
    margin-right: 40px;
    border-radius: 50px;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 10px;
`;

export const TextInput = (styled as any).TextInput`
    padding: 10px;
    width: 100%;
    height: 50px;
    font-size: 20px;
    text-align: center;
`;

export const InnerContainer = (styled as any).View`
    height: 100%;
`;

export const LoadingContainer = (styled as any).View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;