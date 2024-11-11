import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SectionList,
  LayoutAnimation,
  Alert,
  Switch,
} from 'react-native';
import icon_add from '../assets/icon_add.png';
import icon_game from '../assets/icon_game.png';
import icon_platform from '../assets/icon_platform.png';
import icon_bank from '../assets/icon_bank.png';
import icon_other from '../assets/icon_other.png';
import icon_arrow from '../assets/icon_arrow.png';

import AddAccount from '../components/AddAccount';
import {load, save} from '../utils/Storage';

const iconMap = {
  游戏: icon_game,
  平台: icon_platform,
  银行卡: icon_bank,
  其他: icon_other,
};

export default () => {
  const addAccountRef = useRef(null);
  const [sectionData, setSectionData] = useState([]);
  const [sectionState, setSectionState] = useState({
    游戏: true,
    平台: true,
    银行卡: true,
    其他: true,
  });
  const [passwordOpen, setPasswordOpen] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    load('accountList').then(data => {
      const accountList = JSON.parse(data);
      const gameList = accountList.filter(item => item.type === '游戏');
      const platformList = accountList.filter(item => item.type === '平台');
      const bankList = accountList.filter(item => item.type === '银行卡');
      const otherList = accountList.filter(item => item.type === '其他');

      // 使用分组列表
      const sectionData = [
        {type: '游戏', data: gameList},
        {type: '平台', data: platformList},
        {type: '银行卡', data: bankList},
        {type: '其他', data: otherList},
      ];
      LayoutAnimation.easeInEaseOut();
      setSectionData(sectionData);
    });
  };

  const onAccountSaveSuccess = () => {
    loadData();
  };

  const deleteAccount = account => {
    load('accountList').then(data => {
      let accountList = JSON.parse(data);
      accountList = accountList.filter(item => item.id !== account.id);
      console.log('accountList: ', accountList);
      save('accountList', JSON.stringify(accountList)).then(() => {
        console.log('success.');
        loadData();
      });
    });
  };

  const renderTitle = () => {
    return (
      <View style={styles.titleLayout}>
        <Text style={styles.titleText}>账号管理</Text>
        <Switch
          style={styles.switch}
          value={passwordOpen}
          onValueChange={value => setPasswordOpen(value)}
        />
      </View>
    );
  };

  const renderItem = ({item, index, section}) => {
    if (!sectionState[section.type]) return null;
    return (
      <TouchableOpacity
        style={styles.itemLayout}
        onLongPress={() => {
          const buttons = [
            {text: '取消', onPress: () => {}},
            {text: '确定', onPress: () => deleteAccount(item)},
          ];
          Alert.alert('提示', `确定删除「${item.name}」账号吗？`, buttons);
        }}
        onPress={() => {
          addAccountRef.current.show(item);
        }}>
        <Text style={styles.nameTxt}>{item.name}</Text>
        <View style={styles.accpwdLayout}>
          <Text style={styles.accpwdTxt}>{`账号：${item.account}`}</Text>
          <Text style={styles.accpwdTxt}>{`密码：${
            passwordOpen ? item.password : '********'
          }`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({section}) => {
    return (
      <View
        style={[
          styles.groupHeader,
          {
            borderBottomLeftRadius:
              !section.data.length || !sectionState[section.type] ? 12 : 0,
            borderBottomRightRadius:
              !section.data.length || !sectionState[section.type] ? 12 : 0,
          },
        ]}>
        <Image style={styles.typeImg} source={iconMap[section.type]} />
        <Text style={styles.typeTxt}>{section.type}</Text>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setSectionState({
              ...sectionState,
              [section.type]: !sectionState[section.type],
            });
          }}>
          <Image
            style={[
              styles.arrowImg,
              {
                transform: [
                  {rotate: sectionState[section.type] ? '0deg' : '-90deg'},
                ],
              },
            ]}
            source={icon_arrow}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderTitle()}

      <SectionList
        sections={sectionData}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.5}
        onPress={() => {
          addAccountRef.current.show();
        }}>
        <Image style={styles.addImg} source={icon_add} />
      </TouchableOpacity>

      <AddAccount ref={addAccountRef} onSave={onAccountSaveSuccess} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  titleLayout: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 64,
    right: 20,
  },
  addImg: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  groupHeader: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 12,
  },
  typeImg: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  typeTxt: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 16,
  },
  arrowButton: {
    position: 'absolute',
    right: 0,
    padding: 16,
  },
  arrowImg: {
    width: 20,
    height: 20,
  },
  itemLayout: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  nameTxt: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  accpwdLayout: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accpwdTxt: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    marginBottom: 6,
  },
  switch: {
    position: 'absolute',
    right: 12,
  },
});
