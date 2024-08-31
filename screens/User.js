import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Api from "../api.js";
import { useAuth } from "../context/AuthContextWrapper.js";
import UpdateProfilButton from "../components/UpdateProfile.js";
import SelectProfilePage from "../components/SelectProfilePage.js";
import LogoutComponent from "../components/LogoutButton.js";

function ProfilePage() {
  const { logout } = useAuth();
  const [userDetail, setUserDetail] = useState(null);
  const [select, setSelect] = useState("-1");
  const [updateForm, setUpdateForm] = useState(false);
  const [reloadInfos, setReloadInfos] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getUserInfo();
  }, [reloadInfos]);

  async function getUserInfo() {
    try {
      const response = await Api.get(`/users`);
      setUserDetail(response.data);
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  }

  async function confirmDelete() {
    try {
      await Api.delete("/users", userDetail._id);
      logout();
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  }

  if (!userDetail) {
    return <Text>Loading...</Text>;
  }

  function handleDashboard() {
    navigation.navigate("Dashboard");
  }

  if (!userDetail) {
    return <Text>Loading...</Text>;
  }

  const renderProfileContent = () => (
    <View style={styles.content}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your ID Card</Text>
          <Text style={styles.headerSubtitle}>
            From the CleanMotherEarth Community
          </Text>
          <View style={styles.profileInfo}>
            <Image source={{ uri: userDetail.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{userDetail.pseudo}</Text>
            <Text style={styles.subName}>{userDetail.name}</Text>
            <Text style={styles.email}>
              {userDetail.email || "No email provided"}
            </Text>
          </View>
        </View>
        <LogoutComponent />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => setUpdateForm(true)}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {userDetail.role === "admin" && (
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={styles.buttonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        )}

        <View style={styles.selectContainer}>
          <SelectProfilePage select={select} setSelect={setSelect} />
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={[{ key: "profile" }]}
      renderItem={
        updateForm
          ? () => (
              <UpdateProfilButton
                reloadInfos={reloadInfos}
                updateForm={updateForm}
                setReloadInfos={setReloadInfos}
                userDetail={userDetail}
                setUpdateForm={setUpdateForm}
              />
            )
          : renderProfileContent
      }
      keyExtractor={(item) => item.key}
      ListFooterComponent={() => (
        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete your account?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDeleteButton}
                  onPress={confirmDelete}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F3FF",
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: "#3B82F6",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#1E3A8A",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  subName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  email: {
    fontSize: 16,
    color: "#1E3A8A",
  },
  selectContainer: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  dashboardButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
  },
  modalButton: {
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
  },
  modalDeleteButton: {
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },
  modalButtonText: {
    fontWeight: "bold",
    color: "white",
  },
});

export default ProfilePage;
