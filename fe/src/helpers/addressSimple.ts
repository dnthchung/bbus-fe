//path : src/helpers/addressSimple.ts
export interface Ward {
    Id?: string // Không bắt buộc
    Name?: string // Không bắt buộc
    Level?: string // Không bắt buộc
  }
  
  export interface District {
    Id?: string // Không bắt buộc
    Name?: string // Không bắt buộc
    Wards?: Ward[] // Mảng Wards cũng có thể là tùy chọn
  }
  
  export interface Province {
    Id?: string // Không bắt buộc
    Name?: string // Không bắt buộc
    Districts?: District[] // Mảng Districts cũng có thể là tùy chọn
  }
  
  export const addressSimple: Province[] = [
    {
      Id: '01',
      Name: 'Thành phố Hà Nội',
      Districts: [
        {
          Id: '001',
          Name: 'Quận Ba Đình',
          Wards: [
            {
              Id: '00001',
              Name: 'Phường Phúc Xá',
              Level: 'Phường',
            },
            {
              Id: '00004',
              Name: 'Phường Trúc Bạch',
              Level: 'Phường',
            },
            {
              Id: '00007',
              Name: 'Phường Cống Vị',
              Level: 'Phường',
            }
          ],
        },
        {
          Id: '002',
          Name: 'Quận Hoàn Kiếm',
          Wards: [
            {
              Id: '00037',
              Name: 'Phường Phúc Tân',
              Level: 'Phường',
            },
            {
              Id: '00040',
              Name: 'Phường Đồng Xuân',
              Level: 'Phường',
            },
            {
              Id: '00043',
              Name: 'Phường Hàng Mã',
              Level: 'Phường',
            }
          ],
        }
      ],
    },
    {
      Id: '79',
      Name: 'Thành phố Hồ Chí Minh',
      Districts: [
        {
          Id: '760',
          Name: 'Quận 1',
          Wards: [
            {
              Id: '26734',
              Name: 'Phường Bến Nghé',
              Level: 'Phường',
            },
            {
              Id: '26737',
              Name: 'Phường Bến Thành',
              Level: 'Phường',
            },
            {
              Id: '26740',
              Name: 'Phường Cầu Kho',
              Level: 'Phường',
            }
          ],
        },
        {
          Id: '761',
          Name: 'Quận 12',
          Wards: [
            {
              Id: '26743',
              Name: 'Phường Thạnh Xuân',
              Level: 'Phường',
            },
            {
              Id: '26746',
              Name: 'Phường Thạnh Lộc',
              Level: 'Phường',
            },
            {
              Id: '26749',
              Name: 'Phường Hiệp Thành',
              Level: 'Phường',
            }
          ],
        }
      ],
    },
    {
      Id: '48',
      Name: 'Thành phố Đà Nẵng',
      Districts: [
        {
          Id: '490',
          Name: 'Quận Liên Chiểu',
          Wards: [
            {
              Id: '20194',
              Name: 'Phường Hòa Hiệp Bắc',
              Level: 'Phường',
            },
            {
              Id: '20195',
              Name: 'Phường Hòa Hiệp Nam',
              Level: 'Phường',
            },
            {
              Id: '20197',
              Name: 'Phường Hòa Khánh Bắc',
              Level: 'Phường',
            }
          ],
        },
        {
          Id: '491',
          Name: 'Quận Thanh Khê',
          Wards: [
            {
              Id: '20203',
              Name: 'Phường Tam Thuận',
              Level: 'Phường',
            },
            {
              Id: '20206',
              Name: 'Phường Thanh Khê Tây',
              Level: 'Phường',
            },
            {
              Id: '20207',
              Name: 'Phường Thanh Khê Đông',
              Level: 'Phường',
            }
          ],
        }
      ],
    }
  ];