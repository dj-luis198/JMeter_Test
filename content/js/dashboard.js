/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.89763779527559, "KoPercent": 1.1023622047244095};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7724510465901417, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.018518518518518517, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a8cea25-c1c7-47a8-956f-c35d24bff1f0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/004008b1-ad7b-4958-a330-88543b83f8aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9053788-079c-46eb-be40-b5afdcf07259"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1939493b-d273-41f9-aff0-b00f6dc1fc93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68d1acf9-19c6-4e22-a4e6-3906ece307af"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0661ffb-d9ef-463e-a0b2-e0b9202eb146"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=680963fe-bc33-4d3e-a85a-f00bf4e6f43b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34436002-35ab-4ad5-925d-7bdbf93abf21"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34436002-35ab-4ad5-925d-7bdbf93abf21"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b91ee59f-84f7-418b-a169-26326dadfb73"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/035bded2-a6ad-46f0-8f59-5ba603fd3d31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cdec429-e037-4942-b003-ec64c00c6a1c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/680963fe-bc33-4d3e-a85a-f00bf4e6f43b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6519ab7-2f23-4bb8-a7fc-c9208599321b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e30934e9-5fe3-42e0-9ddf-18d47980fecb"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=331a753d-f281-4b5b-9683-1c02be260e41"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=477b84db-fd5f-4cfb-a63a-f03f97e22d64"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9053788-079c-46eb-be40-b5afdcf07259"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1939493b-d273-41f9-aff0-b00f6dc1fc93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0661ffb-d9ef-463e-a0b2-e0b9202eb146"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a8cea25-c1c7-47a8-956f-c35d24bff1f0"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.936046511627907, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=035bded2-a6ad-46f0-8f59-5ba603fd3d31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e002294a-e4b1-42c3-8093-a362e59c396a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24b57975-21fe-4ba5-bd5d-e43222a93dd3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68d1acf9-19c6-4e22-a4e6-3906ece307af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e30934e9-5fe3-42e0-9ddf-18d47980fecb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/331a753d-f281-4b5b-9683-1c02be260e41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cdec429-e037-4942-b003-ec64c00c6a1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6519ab7-2f23-4bb8-a7fc-c9208599321b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/477b84db-fd5f-4cfb-a63a-f03f97e22d64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1270, 14, 1.1023622047244095, 412.6094488188978, 104, 4928, 140.0, 1133.8000000000002, 1361.45, 1920.409999999999, 5.070649721912792, 710.2366634363733, 3.694285393983494], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1883.648148148148, 1415, 2594, 1822.0, 2310.0, 2376.75, 2594.0, 0.24692148354085405, 297.1314373559625, 1.2141110054962891], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a8cea25-c1c7-47a8-956f-c35d24bff1f0", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 526.8571428571429, 129, 1067, 512.5, 834.0, 1067.0, 1067.0, 0.07670014079954418, 0.014482929767324645, 0.05186996826531674], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 526.8571428571429, 129, 1067, 512.5, 834.0, 1067.0, 1067.0, 0.07506501166188574, 0.014174175960430016, 0.05076418024985926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/004008b1-ad7b-4958-a330-88543b83f8aa", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 135.45, 108, 345, 113.5, 314.90000000000043, 344.6, 345.0, 0.09488251172985052, 0.032513938833988815, 0.05371425004862729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 136.95, 108, 340, 115.5, 298.0000000000004, 338.84999999999997, 340.0, 0.09487936089262503, 0.07051093128836684, 0.04762499169805592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9053788-079c-46eb-be40-b5afdcf07259", 3, 0, 0.0, 383.6666666666667, 288, 552, 311.0, 552.0, 552.0, 552.0, 0.06924088905301545, 0.03132969914833707, 0.04440252325339857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 203.75, 106, 629, 114.0, 340.7, 614.5999999999998, 629.0, 0.09488071122581135, 1.4191986226878757, 0.0554644470114948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 199.8, 104, 1207, 114.0, 340.9, 1163.6999999999994, 1207.0, 0.09487936089262503, 4.2929250906690894, 0.055371002020930385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1939493b-d273-41f9-aff0-b00f6dc1fc93", 3, 0, 0.0, 691.3333333333334, 375, 984, 715.0, 984.0, 984.0, 984.0, 0.02785618778784727, 0.027937797713006984, 0.01786350584051404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68d1acf9-19c6-4e22-a4e6-3906ece307af", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0661ffb-d9ef-463e-a0b2-e0b9202eb146", 3, 0, 0.0, 516.3333333333334, 267, 799, 483.0, 799.0, 799.0, 799.0, 0.022512888628739954, 0.02700520657451391, 0.014436976106320868], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 255.2857142857143, 109, 443, 237.0, 409.0, 443.0, 443.0, 0.07677711603215864, 0.15984699931723206, 0.049629850325754336], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=680963fe-bc33-4d3e-a85a-f00bf4e6f43b", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 114.84615384615385, 109, 123, 116.0, 122.2, 123.0, 123.0, 0.09517673587723666, 0.0707319296900167, 0.04777426000087856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 185.8461538461538, 107, 400, 115.0, 376.79999999999995, 400.0, 400.0, 0.09518300763660592, 0.05845975589219426, 0.05243931625652552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 843.6666666666666, 750, 906, 875.0, 906.0, 906.0, 906.0, 0.04171997552428102, 12.26705803770095, 0.023793423541191523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1193.3333333333333, 968, 1337, 1275.0, 1337.0, 1337.0, 1337.0, 0.04138216428719222, 37.23574416770122, 0.0235603533002276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 190.0, 113, 342, 115.0, 342.0, 342.0, 342.0, 0.04195804195804196, 0.07424606643356643, 0.023232626748251748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 138.55, 108, 340, 116.0, 315.90000000000043, 339.85, 340.0, 0.09745021512134988, 0.07242149776108131, 0.048915440012083825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 211.65000000000003, 110, 343, 118.5, 339.9, 342.85, 343.0, 0.09734965562559322, 0.047980831244371976, 0.05429334797634403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 344.35, 111, 1317, 117.0, 1282.3000000000002, 1315.5, 1317.0, 0.09734065335046528, 13.160394544482244, 0.05597087567651754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 264.45, 107, 952, 116.5, 641.7, 936.5499999999997, 952.0, 0.09734160087996807, 4.3155505184657015, 0.05606648066309099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 186.33333333333331, 113, 330, 116.0, 330.0, 330.0, 330.0, 0.04209108510817409, 0.031280581804023905, 0.023635130798046973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34436002-35ab-4ad5-925d-7bdbf93abf21", 3, 0, 0.0, 344.6666666666667, 218, 444, 372.0, 444.0, 444.0, 444.0, 0.021207408454686837, 0.02506643883429945, 0.013599802947829774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 752.0555555555554, 108, 1573, 1039.0, 1369.6000000000004, 1573.0, 1573.0, 0.10112586799703364, 50.563910582962535, 0.054622891806557446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 386.9230769230769, 105, 1328, 116.0, 1249.6, 1328.0, 1328.0, 0.09517673587723666, 19.78285490626922, 0.05406599133891704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 539.0555555555555, 108, 974, 672.0, 922.7, 974.0, 974.0, 0.1011264361358465, 16.53129740301694, 0.05472195497064524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 269.46153846153845, 109, 879, 115.0, 856.6, 879.0, 879.0, 0.09517185841355834, 6.4775059253633005, 0.05415616192027527], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 450.5, 134, 886, 449.0, 865.0, 886.0, 886.0, 0.07521745904677989, 0.014202961888925303, 0.05147589918442783], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 530.65, 228, 1426, 453.5, 1398.6000000000001, 1424.85, 1426.0, 0.09728809436945154, 17.586718464976286, 0.21506939377356196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34436002-35ab-4ad5-925d-7bdbf93abf21", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 748.2000000000002, 124, 2999, 633.5, 1196.1000000000001, 2908.949999999999, 2999.0, 0.0991375037176564, 0.06089598617031823, 0.04482486740358878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 140.2777777777778, 110, 346, 115.0, 342.4, 346.0, 346.0, 0.10112359550561797, 0.0751514220505618, 0.0507593047752809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 198.33333333333334, 107, 342, 116.5, 341.1, 342.0, 342.0, 0.10113041328628897, 0.11144536429422208, 0.052957397408814076], "isController": false}, {"data": ["login", 20, 0, 0.0, 3275.4000000000005, 1992, 7710, 2799.5, 4891.7, 7569.649999999998, 7710.0, 0.09850033243862198, 17.814318985631264, 0.17311625809549608], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 136.3846153846154, 113, 345, 118.0, 258.5999999999999, 345.0, 345.0, 0.09533098183578138, 0.07717713275572537, 0.03388718494943792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b91ee59f-84f7-418b-a169-26326dadfb73", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.6273790520628684, 1.1722587180746562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/035bded2-a6ad-46f0-8f59-5ba603fd3d31", 3, 0, 0.0, 606.3333333333334, 285, 1007, 527.0, 1007.0, 1007.0, 1007.0, 0.08296001327360213, 0.037537245589292625, 0.053200268928709694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cdec429-e037-4942-b003-ec64c00c6a1c", 1, 0, 0.0, 886.0, 886, 886, 886.0, 886.0, 886.0, 886.0, 1.128668171557562, 0.20390977708803612, 0.7781637979683973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/680963fe-bc33-4d3e-a85a-f00bf4e6f43b", 3, 0, 0.0, 438.3333333333333, 238, 631, 446.0, 631.0, 631.0, 631.0, 0.02367330834484119, 0.02798104902347603, 0.015181125468534229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6519ab7-2f23-4bb8-a7fc-c9208599321b", 3, 0, 0.0, 315.0, 231, 478, 236.0, 478.0, 478.0, 478.0, 0.016531202644992422, 0.022789597396335584, 0.010601064196170271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e30934e9-5fe3-42e0-9ddf-18d47980fecb", 3, 0, 0.0, 321.3333333333333, 215, 434, 315.0, 434.0, 434.0, 434.0, 0.0193699597750502, 0.02670305327061771, 0.01242149113178675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 894.2222222222224, 225, 1692, 1153.5, 1485.0000000000002, 1692.0, 1692.0, 0.10105830502765067, 67.23675715127867, 0.21291765502624707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=331a753d-f281-4b5b-9683-1c02be260e41", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 384.79999999999995, 223, 1318, 238.0, 678.8000000000001, 1286.1499999999996, 1318.0, 0.09482672786151504, 5.811901443322065, 0.21205441809578449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 1062.75, 109, 1668, 1237.0, 1668.0, 1668.0, 1668.0, 0.04196303057006777, 37.65458705099557, 0.07773815331193218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=477b84db-fd5f-4cfb-a63a-f03f97e22d64", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1254.0434782608697, 463, 2363, 1146.0, 2108.2000000000007, 2358.2, 2363.0, 0.09249280164717616, 0.029281009217108755, 0.041730150743159555], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9053788-079c-46eb-be40-b5afdcf07259", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 521.8461538461538, 224, 1439, 239.0, 1363.3999999999999, 1439.0, 1439.0, 0.09508693139843619, 26.364980328891065, 0.2082383797369749], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1939493b-d273-41f9-aff0-b00f6dc1fc93", 1, 0, 0.0, 844.0, 844, 844, 844.0, 844.0, 844.0, 844.0, 1.1848341232227488, 0.2140569460900474, 0.8168875888625593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 119.83333333333333, 114, 132, 118.0, 131.1, 132.0, 132.0, 0.11696704453520221, 0.09080937539598218, 0.04157812911212266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 388.21428571428567, 225, 685, 443.5, 629.0, 685.0, 685.0, 0.10910649573315669, 0.16909375852394498, 0.24538306608736313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 120.57142857142857, 114, 133, 116.0, 133.0, 133.0, 133.0, 0.041599562610313126, 0.03091529994770341, 0.020881030450879832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 173.85714285714286, 108, 350, 112.0, 350.0, 350.0, 350.0, 0.0415541242468315, 0.011118974651984208, 0.023698836484521087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 176.14285714285714, 109, 339, 114.0, 339.0, 339.0, 339.0, 0.04160351846899052, 0.0112134483373451, 0.02445831847493388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 174.85714285714286, 108, 331, 112.0, 331.0, 331.0, 331.0, 0.04154968451918112, 0.011198938405560533, 0.02446724586432247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 2.200909514925373, 4.613164645522388], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1283.8333333333335, 872, 2106, 1226.5, 1835.0, 1884.25, 2106.0, 0.24640319776594433, 294.78388813979274, 0.48655006433861275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1254.0434782608697, 463, 2363, 1146.0, 2108.2000000000007, 2358.2, 2363.0, 0.09290189156329648, 0.0294105173019675, 0.041914720607659155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 138.33333333333334, 108, 342, 113.0, 342.0, 342.0, 342.0, 0.048334863937358016, 0.013027756295616028, 0.028462815384987194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 164.55555555555554, 109, 342, 115.0, 342.0, 342.0, 342.0, 0.048274974253347064, 0.013011614154222452, 0.028380404785659116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 133.75, 107, 342, 115.5, 276.0000000000002, 342.0, 342.0, 0.1169773064025579, 0.03152903961631443, 0.06876986177181627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0661ffb-d9ef-463e-a0b2-e0b9202eb146", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 190.58333333333334, 104, 341, 120.0, 340.7, 341.0, 341.0, 0.11672584018287048, 0.03146126161178931, 0.06873601721706142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 114.66666666666667, 109, 120, 115.0, 120.0, 120.0, 120.0, 0.04833356605050321, 0.012933004978357305, 0.02756523688817761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 135.08333333333334, 108, 345, 116.0, 280.5000000000002, 345.0, 345.0, 0.11697274535033338, 0.08692994063633173, 0.05871483506842906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 114.22222222222223, 106, 117, 116.0, 117.0, 117.0, 117.0, 0.048332268233348186, 0.035918804810134736, 0.024260533078067352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 132.58333333333334, 106, 321, 113.0, 268.50000000000017, 321.0, 321.0, 0.1169773064025579, 0.03130056831474694, 0.0667136200577088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 124.33333333333333, 117, 136, 124.0, 136.0, 136.0, 136.0, 0.04648832368270169, 0.036591395398689025, 0.016525146309085366], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 529.8461538461539, 434, 799, 497.0, 765.4, 799.0, 799.0, 0.07396533870435484, 0.013362878574517234, 0.050345547926694656], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1890.3, 1084, 4928, 1555.5, 3926.600000000004, 4887.4, 4928.0, 0.09838694602000207, 0.050922931045508886, 0.04525415192912204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 281.22222222222223, 226, 457, 233.0, 457.0, 457.0, 457.0, 0.04824417987574443, 0.0747690561160219, 0.10850229126351507], "isController": false}, {"data": ["addBook", 59, 6, 10.169491525423728, 1323.1525423728822, 603, 4475, 997.0, 2118.0, 3227.0, 4475.0, 0.27719181203576243, 96.62408029724124, 1.0058709827741732], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6a8cea25-c1c7-47a8-956f-c35d24bff1f0", 3, 0, 0.0, 323.6666666666667, 234, 497, 240.0, 497.0, 497.0, 497.0, 0.10121457489878542, 0.04579695934547908, 0.06490648195006747], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 208.92592592592595, 109, 614, 117.5, 459.0, 470.75, 614.0, 0.24755085107065744, 0.18397089615700224, 0.119665694609351], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 726.6481481481483, 532, 1000, 677.5, 931.5, 984.75, 1000.0, 0.24747143767156873, 72.76481950052015, 0.1244607328133378], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 170.5, 106, 462, 116.5, 344.5, 376.75, 462.0, 0.2479748718796495, 0.4387992850057861, 0.12059715448834518], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1070.0185185185182, 735, 1618, 1043.0, 1401.0, 1452.75, 1618.0, 0.24694858439010556, 222.2047703235255, 0.12395661364893971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 135.78571428571428, 105, 352, 119.0, 242.5, 352.0, 352.0, 0.10862565272378824, 0.08115100032587695, 0.0386130249916591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, 3.488372093023256, 231.48255813953492, 109, 3797, 122.0, 345.70000000000005, 445.39999999999975, 2385.18000000002, 0.7275926834633412, 1.5560654843990593, 0.3512297030195097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 120.57142857142858, 113, 130, 119.0, 130.0, 130.0, 130.0, 0.04169943050492053, 0.03229262538125194, 0.01482284443729597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 147.2, 114, 438, 118.5, 327.80000000000047, 433.5999999999999, 438.0, 0.09750152346130408, 0.07912477148080439, 0.03465874466788543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=035bded2-a6ad-46f0-8f59-5ba603fd3d31", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 362.00000000000006, 228, 475, 444.0, 475.0, 475.0, 475.0, 0.04151838671411625, 0.06434539034697509, 0.09337582480723607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e002294a-e4b1-42c3-8093-a362e59c396a", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.7750872269417476, 1.4482516686893205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24b57975-21fe-4ba5-bd5d-e43222a93dd3", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 346.50000000000006, 228, 685, 254.5, 620.5000000000002, 685.0, 685.0, 0.11659314820932357, 0.1806966076251919, 0.26222072297467985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68d1acf9-19c6-4e22-a4e6-3906ece307af", 3, 0, 0.0, 383.0, 222, 484, 443.0, 484.0, 484.0, 484.0, 0.057946380282778334, 0.026860561693579543, 0.037159625376651476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e30934e9-5fe3-42e0-9ddf-18d47980fecb", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/331a753d-f281-4b5b-9683-1c02be260e41", 3, 0, 0.0, 363.6666666666667, 230, 544, 317.0, 544.0, 544.0, 544.0, 0.027052373394892512, 0.022288267272940414, 0.017348038928365315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 129.95, 114, 331, 118.5, 132.70000000000002, 321.09999999999985, 331.0, 0.10129608338693584, 0.0839847410112388, 0.03600759214144985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cdec429-e037-4942-b003-ec64c00c6a1c", 3, 0, 0.0, 300.6666666666667, 216, 463, 223.0, 463.0, 463.0, 463.0, 0.052910052910052914, 0.03401606591710758, 0.03392994929453263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 120.88888888888891, 106, 152, 119.0, 137.60000000000002, 152.0, 152.0, 0.10046044370029301, 0.07799419213059858, 0.03571054834658853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6519ab7-2f23-4bb8-a7fc-c9208599321b", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/477b84db-fd5f-4cfb-a63a-f03f97e22d64", 3, 0, 0.0, 853.3333333333334, 207, 1848, 505.0, 1848.0, 1848.0, 1848.0, 0.020250977109645543, 0.023935969363646798, 0.012986466440755767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 130.5, 107, 341, 115.0, 230.0, 341.0, 341.0, 0.10939978588899046, 0.08130198931789233, 0.05491356440130967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 206.42857142857144, 110, 345, 119.0, 337.0, 345.0, 345.0, 0.10939978588899046, 0.02927298958357753, 0.06239206538981488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 178.5, 107, 345, 114.5, 344.5, 345.0, 345.0, 0.10920607185759529, 0.029434449055367476, 0.0642012258381566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 206.14285714285717, 107, 454, 115.0, 434.5, 454.0, 454.0, 0.10920947938281043, 0.029435367489898126, 0.06430987897249482], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.3937007874015748], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07874015748031496], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6299212598425197], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1270, 14, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
