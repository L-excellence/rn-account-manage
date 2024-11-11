import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import icon_close_modal from '../assets/icon_close_modal.png';
import {getUUID} from '../utils/UUID';
import {load, save} from '../utils/Storage';

export default forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('游戏');
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isModify, setIsModify] = useState(); // 区分编辑和添加

  const [id, setId] = useState('');

  const show = currentAccount => {
    setVisible(true);
    if (currentAccount) {
      setIsModify(true);
      setId(currentAccount.id);
      setType(currentAccount.type);
      setName(currentAccount.name);
      setAccount(currentAccount.account);
      setPassword(currentAccount.password);
    } else {
      setIsModify(false);
      setId(getUUID());
      setType('游戏');
      setName('');
      setAccount('');
      setPassword('');
    }
  };

  const hide = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => {
    return {
      show,
      hide,
    };
  });

  const onSaveAccount = () => {
    const newAccount = {
      id,
      type,
      name,
      account,
      password,
    };
    // 读取本地缓存数据集合
    load('accountList').then(data => {
      let accountList = data ? JSON.parse(data) : [];
      if (isModify) {
        accountList = accountList.filter(item => item.id !== id);
      }
      accountList.push(newAccount);
      save('accountList', JSON.stringify(accountList)).then(() => {
        hide();
        props.onSave();
      });
    });
  };

  const renderTitle = () => {
    const styles = StyleSheet.create({
      titleLayout: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleTxt: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
      },
      closeButton: {
        position: 'absolute',
        right: 6,
      },
      closeImg: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
      },
    });

    return (
      <View style={styles.titleLayout}>
        <Text style={styles.titleTxt}>
          {isModify ? '修改账号' : '添加账号'}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={hide}>
          <Image style={styles.closeImg} source={icon_close_modal} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderType = () => {
    const styles = StyleSheet.create({
      typesLayout: {
        width: '100%',
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
      },
      tab: {
        flex: 1,
        height: '100%',
        borderWidth: 1,
        borderColor: '#C0C0C0',
        justifyContent: 'center',
        alignItems: 'center',
      },
      leftTab: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      },
      rightTab: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      },
      hideBorderRightTab: {
        borderRightWidth: 0,
      },
      tabTxt: {
        fontSize: 14,
      },
    });

    const typesArray = ['游戏', '平台', '银行卡', '其他'];

    return (
      <View style={styles.typesLayout}>
        {typesArray.map((item, index) => (
          <TouchableOpacity
            style={[
              styles.tab,
              index === 0 ? styles.leftTab : {},
              index === typesArray.length - 1 ? styles.rightTab : {},
              index !== typesArray.length - 1 ? styles.hideBorderRightTab : {},
              {backgroundColor: type === item ? '#3050ff' : 'transparent'},
            ]}
            onPress={() => {
              setType(item);
            }}
            key={item}>
            <Text
              style={[
                styles.tabTxt,
                {color: type === item ? 'white' : '#666'},
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderName = () => {
    const styles = StyleSheet.create({
      input: {
        width: '100%',
        height: 40,
        backgroundColor: '#f0f0f0',
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333',
      },
    });

    return (
      <TextInput
        style={styles.input}
        maxLength={20}
        value={name}
        onChangeText={text => {
          setName(text || '');
        }}
      />
    );
  };

  const renderAccount = () => {
    const styles = StyleSheet.create({
      input: {
        width: '100%',
        height: 40,
        backgroundColor: '#f0f0f0',
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333',
      },
    });

    return (
      <TextInput
        style={styles.input}
        maxLength={20}
        value={account}
        onChangeText={text => {
          setAccount(text || '');
        }}
      />
    );
  };

  const renderPassword = () => {
    const styles = StyleSheet.create({
      input: {
        width: '100%',
        height: 40,
        backgroundColor: '#f0f0f0',
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333',
      },
    });

    return (
      <TextInput
        style={styles.input}
        maxLength={20}
        value={password}
        onChangeText={text => {
          setPassword(text || '');
        }}
      />
    );
  };

  const renderButton = () => {
    const styles = StyleSheet.create({
      saveButton: {
        width: '100%',
        height: 44,
        backgroundColor: '#3050ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 8,
        marginBottom: 6,
      },
      saveTxt: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
      },
    });

    return (
      <TouchableOpacity style={styles.saveButton} onPress={onSaveAccount}>
        <Text style={styles.saveTxt}>保存</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={hide}
      transparent={true}
      statusBarTranslucent={true}
      animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}>
        <View style={styles.content}>
          {renderTitle()}
          <Text style={styles.subTitleTxt}>账号类型</Text>
          {renderType()}
          <Text style={styles.subTitleTxt}>账号名称</Text>
          {renderName()}
          <Text style={styles.subTitleTxt}>账号</Text>
          {renderAccount()}
          <Text style={styles.subTitleTxt}>密码</Text>
          {renderPassword()}
          {renderButton()}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000060',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  subTitleTxt: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
  },
});
