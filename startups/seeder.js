const CreateAdminUseCase = require("../app/admin/usecases/CreateAdminUseCase");
const adminRepo = require("../app/admin/repository/admin_repo");

const createSuperAdmin = async () => {
  const admin = await adminRepo.findAll();
  if (admin.length === 0) {
    await CreateAdminUseCase.execute({
      name: "superadmin",
      email: process.env.QC_SUPER_EMAIL,
      password: process.env.QC_SUPER_PASSWORD,
    });
  }
};

module.exports = async () => {
  await createSuperAdmin();
};
