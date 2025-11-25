import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "components/Atoms";
import { DropdownWithLabel, EditTextComponent } from "components/EditFormComponents";
import { Button } from "components/Button";
import { Spinner } from "@radix-ui/themes";
import Text from "components/Text";
import { platforms, gameDurations } from "utils/constants";
import CitiesTypeahead from "components/CitiesTypeahead";
import CountriesTypeahead from "components/CountriesTypeahead";
import { DropdownItemType } from "types/types";
import { UserDetail, UpdateUserData, UpdatePasswordData } from "services/users.service";
import { useUpdateUser, useUpdatePassword } from "hooks/useUsers";
// Countries and cities hooks are now used directly by the typeahead components

type UserProfileFormProps = {
  data: UserDetail;
};

// Form data interfaces
interface UserProfileFormData {
  name: string;
  phone: string;
  preferredGamingPlatform: string;
  preferredGameDuration: string;
  city: number | null;
  country: number | null;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const inputWidth = "300px";
const dropdownWidth = "300px";

const formStyles = {
  alignItems: "center",
  backgroundColor: "White",
  width: "640px",
  padding: "12px",
  alignSelf: "center",
  // boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px",
  "@sm": {
    width: "100%",
  },
};

const UserProfileForm: React.FC<UserProfileFormProps> = ({ data }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // React Query hooks
  const updateUserMutation = useUpdateUser();
  const updatePasswordMutation = useUpdatePassword();
  // Countries and cities are now fetched directly by the typeahead components

  // React Hook Form for user profile
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
    watch: watchProfile,
  } = useForm<UserProfileFormData>({
    defaultValues: {
      name: data.name || "",
      phone: data.phone_number || "",
      preferredGamingPlatform: data.preferred_gaming_platform || "",
      preferredGameDuration: data.preferred_game_duration || "",
      city: data.cities ? Number(data.cities.id) : null,
      country: data.countries ? Number(data.countries.id) : null,
    },
  });

  // React Hook Form for password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
    watch: watchPassword,
  } = useForm<PasswordFormData>();

  // Watch form values for controlled components
  const watchedCity = watchProfile("city");
  const watchedCountry = watchProfile("country");
  const watchedPlatform = watchProfile("preferredGamingPlatform");
  const watchedDuration = watchProfile("preferredGameDuration");

  // Submit handlers
  const onSubmitProfile = async (formData: UserProfileFormData) => {
    try {
      setErrorMsg("");
      setConfirmationMsg("");

      const updateData: UpdateUserData = {
        firstName: formData.name.split(" ")[0] || "",
        lastName: formData.name.split(" ").slice(1).join(" ") || "",
        name: formData.name,
        email: data.email,
        phone: formData.phone || undefined,
        preferredGamingPlatform: formData.preferredGamingPlatform || undefined,
        preferredGameDuration: formData.preferredGameDuration || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
      };

      await updateUserMutation.mutateAsync(updateData);
      setConfirmationMsg("Profile updated successfully");
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "There was an error updating the profile");
    }
  };

  const onSubmitPassword = async (formData: PasswordFormData) => {
    try {
      setErrorMsg("");
      setConfirmationMsg("");

      const passwordData: UpdatePasswordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      await updatePasswordMutation.mutateAsync(passwordData);
      setConfirmationMsg("Password updated successfully");
      resetPasswordForm();
      setShowPasswordForm(false);
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "There was an error updating the password");
    }
  };

  // Loading states are now handled by individual typeahead components

  // Countries and cities are now fetched directly by the typeahead components

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Profile Update Form */}
      <Form style={formStyles} onSubmit={handleSubmitProfile(onSubmitProfile)}>
        <h2>Update Profile</h2>

        <EditTextComponent
          labelText="Playdek Name"
          inputValue={watchProfile("playdek_name")}
          onInputValueChange={(value) => setProfileValue("playdek_name", value)}
          css={{ width: inputWidth }}
          error={!!profileErrors.playdek_name}
          maxLength={100}
          {...registerProfile("playdek_name", { required: "Playdek name is required" })}
        />

        <EditTextComponent
          labelText="Phone"
          inputValue={watchProfile("phone")}
          onInputValueChange={(value) => setProfileValue("phone", value)}
          css={{ width: inputWidth }}
          error={!!profileErrors.phone}
          maxLength={20}
          {...registerProfile("phone")}
        />

        <DropdownWithLabel
          labelText="Preferred Gaming Platform"
          placeholder="Select preferred gaming platform"
          items={platforms}
          error={!!profileErrors.preferredGamingPlatform}
          css={{ width: dropdownWidth }}
          selectedItem={watchedPlatform}
          onSelect={(value: string) => setProfileValue("preferredGamingPlatform", value)}
        />

        <DropdownWithLabel
          labelText="Preferred Game Duration"
          placeholder="Select preferred game duration"
          items={gameDurations}
          error={!!profileErrors.preferredGameDuration}
          css={{ width: dropdownWidth }}
          selectedItem={watchedDuration}
          onSelect={(value: string) => setProfileValue("preferredGameDuration", value)}
        />

        <CitiesTypeahead
          labelText="City"
          selectedItem={watchedCity?.toString() || ""}
          error={!!profileErrors.city}
          placeholder="Type the city name..."
          css={{ width: "300px" }}
          listWidth="500px"
          onBlur={() => {}}
          onSelect={(value) => setProfileValue("city", value?.value ? Number(value.value) : null)}
        />

        <CountriesTypeahead
          labelText="Country"
          selectedItem={watchedCountry?.toString() || ""}
          error={!!profileErrors.country}
          placeholder="Type the country name..."
          css={{ width: "300px" }}
          listWidth="320px"
          onBlur={() => {}}
          onSelect={(value) => setProfileValue("country", value?.value ? Number(value.value) : null)}
        />

        <Button
          type="submit"
          disabled={updateUserMutation.isPending}
          style={{ width: "200px", fontSize: "18px" }}
        >
          {updateUserMutation.isPending ? <Spinner size="3" /> : "Update Profile"}
        </Button>
      </Form>

      {/* Password Update Section */}
      <div style={{ ...formStyles, marginTop: "20px" }}>
        <h2>Change Password</h2>

        {!showPasswordForm ? (
          <Button
            onClick={() => setShowPasswordForm(true)}
            style={{ width: "200px", fontSize: "16px" }}
          >
            Change Password
          </Button>
        ) : (
          <Form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div style={{ marginBottom: "10px" }}>
              <label>Current Password</label>
              <input
                type="password"
                style={{ width: inputWidth, padding: "8px", marginTop: "5px" }}
                {...registerPassword("currentPassword", { required: "Current password is required" })}
              />
              {passwordErrors.currentPassword && (
                <Text style={{ color: "red", fontSize: "14px" }}>
                  {passwordErrors.currentPassword.message}
                </Text>
              )}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>New Password</label>
              <input
                type="password"
                style={{ width: inputWidth, padding: "8px", marginTop: "5px" }}
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
              />
              {passwordErrors.newPassword && (
                <Text style={{ color: "red", fontSize: "14px" }}>
                  {passwordErrors.newPassword.message}
                </Text>
              )}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Confirm New Password</label>
              <input
                type="password"
                style={{ width: inputWidth, padding: "8px", marginTop: "5px" }}
                {...registerPassword("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watchPassword("newPassword") || "Passwords do not match"
                })}
              />
              {passwordErrors.confirmPassword && (
                <Text style={{ color: "red", fontSize: "14px" }}>
                  {passwordErrors.confirmPassword.message}
                </Text>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                type="submit"
                disabled={updatePasswordMutation.isPending}
                style={{ width: "150px", fontSize: "16px" }}
              >
                {updatePasswordMutation.isPending ? <Spinner size="3" /> : "Update Password"}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  resetPasswordForm();
                }}
                style={{ width: "100px", fontSize: "16px", backgroundColor: "#ccc" }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </div>

      {/* Messages */}
      {confirmationMsg && <Text style={{ color: "green", textAlign: "center" }}>{confirmationMsg}</Text>}
      {errorMsg && <Text style={{ color: "red", textAlign: "center" }}>{errorMsg}</Text>}
    </div>
  );
};

export default UserProfileForm;
