import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function handleFilterLoginData() {
    const dataKey = '@savepass:logins';
    const storagedData = await AsyncStorage.getItem(dataKey)
    const filteredData = data.filter(item => {
      //strings do item e da busca passadas para lowerCase para uso de insensitive-case na busca
      const lower = item.service_name.toLowerCase()
      return lower.includes(searchText.toLowerCase())
    })

    if(searchText && filteredData){
      setSearchListData(filteredData)
    }else{
      if(storagedData){
        setSearchListData(JSON.parse(storagedData))
        setData(JSON.parse(storagedData))
      }
    }
  }

  function handleChangeInputText(text: string) {
    setSearchText(text)
  }

  //Adicionado handleFilterLoginData para busca em tempo real conforme searchText muda
  useFocusEffect(useCallback(() => {
    handleFilterLoginData();
  }, [searchText]));


  return (
    <>
      <Header
        user={{
          name: 'Nicolas',
          avatar_url: 'https://i.ibb.co/ZmFHZDM/rocketseat.jpg'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
            />
          }}
        />
      </Container>
    </>
  )
}