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
import { UserDetail, UpdateUserData, UpdatePasswordData } from "services/users.service";
import { useUpdateUser, useUpdatePassword } from "hooks/useUsers";
import { formStyles } from "./UserProfileForm.styled";

type UserProfileFormProps = {
  data: UserDetail;
};

// Form data interfaces
interface UserProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  playdek_name: string;
  discord_user_id: string;
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
const dropdownWidth = "322px";
const helperTextStyle = { maxWidth: inputWidth, marginTop: "4px", opacity: 0.8 };

const discordUserIdProblem = (value: string): string | null => {
  if (!value) return null;

  if (!/^\d+$/.test(value)) return "The Discord User ID contains only digits. Copy it again from Discord.";

  if (value.length < 17 || value.length > 20) {
    return `The Discord User ID is 17 to 20 digits long. This one has ${value.length}.`;
  }

  return null;
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
    handleSubmit: handleSubmitProfile,
    formState,
    setValue: setProfileValue,
    setError: setProfileError,
    clearErrors: clearProfileErrors,
    watch: watchProfile,
  } = useForm<UserProfileFormData>({
    defaultValues: {
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      email: data.email || "",
      playdek_name: data.playdek_name || "",
      discord_user_id: data.discord_user_id || "",
      phone: data.phone_number || "",
      preferredGamingPlatform: data.preferred_gaming_platform || "",
      preferredGameDuration: data.preferred_game_duration || "",
      city: data.cities ? Number(data.cities.id) : null,
      country: data.countries ? Number(data.countries.id) : null,
    },
  });

  const profileErrors = formState.errors;
  // React Hook Form for password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors  },
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

      const discordUserId = formData.discord_user_id.trim();

      const discordUserIdError = discordUserIdProblem(discordUserId);

      if (discordUserIdError) {
        setProfileError("discord_user_id", { message: discordUserIdError });
        return;
      }

      clearProfileErrors("discord_user_id");

      const updateData: UpdateUserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        playdek_name: formData.playdek_name,
        email: data.email,
        discord_user_id: discordUserId,
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
          labelText="First Name"
          inputValue={watchProfile("firstName") || ""}
          onInputValueChange={(value) => setProfileValue("firstName", value, { shouldValidate: true })}
          css={{ width: inputWidth, color: "var(--primary-text)" }}
          error={!!profileErrors.firstName}
          maxLength={100}
        />
        <EditTextComponent
          labelText="Last Name"
          inputValue={watchProfile("lastName") || ""}
          onInputValueChange={(value) => setProfileValue("lastName", value, { shouldValidate: true })}
          css={{ width: inputWidth, color: "var(--primary-text)" }}
          error={!!profileErrors.lastName}
          maxLength={100}
        />
        <EditTextComponent
          labelText="Email"
          inputValue={watchProfile("email") || ""}
          onInputValueChange={(value) => setProfileValue("email", value, { shouldValidate: true })}
          css={{ width: inputWidth, color: "var(--primary-text)" }}
          error={!!profileErrors.email}
          maxLength={100}
        />

        <EditTextComponent
          labelText="Playdek Name"
          inputValue={watchProfile("playdek_name") || ""}
          onInputValueChange={(value) => setProfileValue("playdek_name", value, { shouldValidate: true })}
          css={{ width: inputWidth, color: "var(--primary-text)" }}
          error={!!profileErrors.playdek_name}
          maxLength={100}
        />

        <EditTextComponent
          labelText="Discord User ID"
          inputValue={watchProfile("discord_user_id") || ""}
          onInputValueChange={(value) => {
            clearProfileErrors("discord_user_id");
            setProfileValue("discord_user_id", value);
          }}
          css={{ width: inputWidth, color: "var(--primary-text)" }}
          error={!!profileErrors.discord_user_id}
          maxLength={20}
        />
        {profileErrors.discord_user_id && (
          <Text type="error" fontSize="small" style={helperTextStyle}>
            {profileErrors.discord_user_id.message}
          </Text>
        )}
        <Text fontSize="small" style={helperTextStyle}>
          This ID can be used to mention you on Discord when results of your games are posted. To
          find it, turn on Developer Mode in Discord under Settings -&gt; Advanced. Then, right-click
          your own name and select Copy User ID.
        </Text>

        <EditTextComponent
          labelText="Phone"
          inputValue={watchProfile("phone") || ""}
          onInputValueChange={(value) => setProfileValue("phone", value)}
          css={{ width: inputWidth, color: "var(--primary-text)" }}
          error={!!profileErrors.phone}
          maxLength={20}
        />

        <DropdownWithLabel
          labelText="Preferred Gaming Platform"
          placeholder="Select Preferred Gaming Platform"
          items={platforms}
          error={!!profileErrors.preferredGamingPlatform}
          width={dropdownWidth}
          css={{ width: dropdownWidth }}
          selectedItem={watchedPlatform}
          onSelect={(value: string) => setProfileValue("preferredGamingPlatform", value)}
        />

        <DropdownWithLabel
          labelText="Preferred Game Duration"
          placeholder="Select Preferred Game Duration"
          items={gameDurations}
          width={dropdownWidth}
          error={!!profileErrors.preferredGameDuration}
          css={{ width: dropdownWidth }}
          selectedItem={watchedDuration}
          onSelect={(value: string) => setProfileValue("preferredGameDuration", value)}
        />

        <CitiesTypeahead
          labelText="City"
          selectedItem={watchedCity?.toString() || ""}
          error={!!profileErrors.city}
          placeholder="Type the City Name..."
          css={{ width: "300px" }}
          width={dropdownWidth}
          listWidth="500px"
          onBlur={() => {}}
          onSelect={(value) => setProfileValue("city", value?.value ? Number(value.value) : null)}
        />

        <CountriesTypeahead
          labelText="Country"
          selectedItem={watchedCountry?.toString() || ""}
          error={!!profileErrors.country}
          placeholder="Type the Country Name..."
          css={{ width: "300px" }}
          width={dropdownWidth}
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
              <label>Current Password</label><br/>
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
              <label>New Password</label><br/>
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
              <label>Confirm New Password</label><br/>
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
                style={{ width: "100px", fontSize: "16px" }}
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
