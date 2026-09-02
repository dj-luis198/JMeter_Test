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

    var data = {"OkPercent": 98.1687898089172, "KoPercent": 1.8312101910828025};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8042291950886766, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3942307692307692, 500, 1500, "see books"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70047050-039b-4402-bbb8-c8c051d7e5b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6650098b-07a3-42d6-89cc-138bf2c40e67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b868175-6428-4ca9-b5f4-b48f338d280e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45342f3c-d1dd-4cdf-a7cb-453cd74d0282"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f081c25-4d75-441d-b2b3-6f5b0ab04042"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9fefe7a-ac41-4e1b-b630-2c5831f2ec3f"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1117fa3f-d082-407f-bc97-e745670ef804"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a9b71a0f-43a3-46fa-93bb-f253ee551eba"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3fbe032-ff92-4699-ad72-ab9301fe8aa8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7e2373c-8ea0-40c8-bd63-c77fe23212f3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/202341db-e41d-44fa-93e6-4f0f03aebebd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e480d4da-472d-49d6-b2cb-6d7ccd364634"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=789c5b93-560c-46f3-b377-53359ccaeb82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f379321-f3e6-4ce1-a3cb-2057f449c52b"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70047050-039b-4402-bbb8-c8c051d7e5b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b868175-6428-4ca9-b5f4-b48f338d280e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/3e4dc6fa-953d-4c68-aa2c-b713072cde32"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45342f3c-d1dd-4cdf-a7cb-453cd74d0282"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6650098b-07a3-42d6-89cc-138bf2c40e67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8557692307692307, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f081c25-4d75-441d-b2b3-6f5b0ab04042"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7291ebf0-6356-4221-a29d-b2f127beb360"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9b71a0f-43a3-46fa-93bb-f253ee551eba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e480d4da-472d-49d6-b2cb-6d7ccd364634"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3fbe032-ff92-4699-ad72-ab9301fe8aa8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f379321-f3e6-4ce1-a3cb-2057f449c52b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1117fa3f-d082-407f-bc97-e745670ef804"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e7e2373c-8ea0-40c8-bd63-c77fe23212f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/789c5b93-560c-46f3-b377-53359ccaeb82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1256, 23, 1.8312101910828025, 327.7587579617832, 77, 2926, 100.0, 883.8999999999999, 1151.1499999999999, 1805.9400000000037, 4.850862997879679, 686.9523400477651, 3.5378595301498903], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 1374.019230769231, 985, 1829, 1342.0, 1685.5000000000002, 1760.7999999999995, 1829.0, 0.21818303878623097, 262.54818809738094, 1.0728042971569072], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 597.642857142857, 85, 1211, 465.0, 1121.5, 1211.0, 1211.0, 0.0720183132282209, 0.013598882108593327, 0.048703790928264615], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 597.642857142857, 85, 1211, 465.0, 1121.5, 1211.0, 1211.0, 0.0711635236110405, 0.013437476172927364, 0.04812572275453668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70047050-039b-4402-bbb8-c8c051d7e5b3", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 105.19047619047618, 79, 248, 80.0, 244.0, 247.7, 248.0, 0.12199868706174877, 0.05882079554762887, 0.0681136642886605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 91.66666666666667, 81, 244, 83.0, 96.4, 229.3999999999998, 244.0, 0.12199443473007279, 0.09066187971639197, 0.061235487745368564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 194.38095238095235, 81, 713, 82.0, 630.0, 705.0999999999999, 713.0, 0.12199797831921642, 5.152678563648089, 0.07034286333612186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 215.71428571428572, 78, 798, 85.0, 724.0, 790.5999999999999, 798.0, 0.12188822269558706, 15.696050449753033, 0.07016054782951901], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 245.53333333333333, 81, 1101, 195.0, 612.6000000000004, 1101.0, 1101.0, 0.07590478503764878, 0.1370536007964942, 0.04906137407902194], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6650098b-07a3-42d6-89cc-138bf2c40e67", 3, 0, 0.0, 337.66666666666663, 187, 625, 201.0, 625.0, 625.0, 625.0, 0.02793920429146178, 0.02802105742903442, 0.017916742335344956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 104.35714285714286, 79, 241, 83.0, 239.5, 241.0, 241.0, 0.10262575319972438, 0.07626777166502954, 0.0515133175240804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 83.57142857142858, 78, 118, 81.0, 102.0, 118.0, 118.0, 0.10262951478231547, 0.027461413135111756, 0.05853089514928929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 564.6666666666666, 458, 724, 545.0, 724.0, 724.0, 724.0, 0.03887042543680641, 11.429195698015665, 0.022168289506928653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 857.0, 725, 992, 875.5, 992.0, 992.0, 992.0, 0.03877221324717286, 34.88730563408724, 0.02207441437802908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 133.83333333333334, 80, 240, 84.5, 240.0, 240.0, 240.0, 0.038930198154708606, 0.06888820220344921, 0.02155607651730447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 84.15384615384615, 82, 88, 83.0, 88.0, 88.0, 88.0, 0.12310256337414656, 0.09148540110129448, 0.06179171638116342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 94.6923076923077, 79, 243, 83.0, 180.59999999999994, 243.0, 243.0, 0.12310606060606061, 0.047163529829545456, 0.06941361860795454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 155.0, 77, 1045, 81.0, 660.1999999999997, 1045.0, 1045.0, 0.12310489484001097, 8.551397551277924, 0.07155841919110614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 111.61538461538461, 78, 482, 80.0, 323.9999999999999, 482.0, 482.0, 0.12310606060606061, 2.8150338837594697, 0.07167931758996213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b868175-6428-4ca9-b5f4-b48f338d280e", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 107.16666666666667, 80, 233, 82.0, 233.0, 233.0, 233.0, 0.03896837716193309, 0.028959897480694417, 0.021881657097765163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 563.7777777777777, 80, 1191, 805.0, 1073.1000000000001, 1191.0, 1191.0, 0.08192020971573687, 40.960895971004796, 0.044249002166334435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 129.07142857142856, 79, 243, 82.5, 242.5, 243.0, 243.0, 0.10250777960827384, 0.02762904997254256, 0.06026336262127037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 404.0, 78, 714, 582.5, 701.4, 714.0, 714.0, 0.08192020971573687, 13.391625393672118, 0.04432900237113496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 128.78571428571428, 78, 242, 86.0, 240.5, 242.0, 242.0, 0.10250777960827384, 0.02762904997254256, 0.060363467874794074], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 628.5384615384615, 87, 2569, 472.0, 1898.1999999999994, 2569.0, 2569.0, 0.0773432015325853, 0.014652911227853073, 0.05290037935352983], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45342f3c-d1dd-4cdf-a7cb-453cd74d0282", 1, 0, 0.0, 892.0, 892, 892, 892.0, 892.0, 892.0, 892.0, 1.1210762331838564, 0.20253818665919282, 0.7729295123318386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 241.38461538461536, 164, 1129, 167.0, 746.5999999999997, 1129.0, 1129.0, 0.1230070492501301, 11.495910606992478, 0.27422477468420303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f081c25-4d75-441d-b2b3-6f5b0ab04042", 3, 0, 0.0, 340.0, 193, 536, 291.0, 536.0, 536.0, 536.0, 0.02266648533478399, 0.0267910183107424, 0.014535473993985824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9fefe7a-ac41-4e1b-b630-2c5831f2ec3f", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 663.181818181818, 175, 1596, 649.5, 1372.1999999999998, 1570.3499999999997, 1596.0, 0.09153889362764475, 0.05622848055838725, 0.04138916772421828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 84.27777777777779, 79, 105, 82.5, 89.70000000000002, 105.0, 105.0, 0.08191648159609713, 0.060877385248662035, 0.04111823392616595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 109.72222222222221, 78, 248, 82.5, 246.2, 248.0, 248.0, 0.08191909124421447, 0.09027455410983529, 0.042897301903708655], "isController": false}, {"data": ["login", 22, 0, 0.0, 3027.909090909091, 1970, 5208, 2872.5, 4199.9, 5059.799999999997, 5208.0, 0.09103661741033928, 29.827302308295504, 0.17852519903914987], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1117fa3f-d082-407f-bc97-e745670ef804", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9b71a0f-43a3-46fa-93bb-f253ee551eba", 3, 0, 0.0, 658.3333333333334, 189, 1071, 715.0, 1071.0, 1071.0, 1071.0, 0.02722495984318423, 0.02730472046772481, 0.01745871448277114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3fbe032-ff92-4699-ad72-ab9301fe8aa8", 1, 0, 0.0, 2569.0, 2569, 2569, 2569.0, 2569.0, 2569.0, 2569.0, 0.38925652004671074, 0.07032466426625146, 0.2683741241728299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 103.00000000000001, 82, 244, 91.0, 180.0, 244.0, 244.0, 0.10318928600384748, 0.08353898251678668, 0.03668056650918016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7e2373c-8ea0-40c8-bd63-c77fe23212f3", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 658.2777777777778, 162, 1274, 888.5, 1163.3000000000002, 1274.0, 1274.0, 0.08188592380969711, 54.48086598913646, 0.17252376113421103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 332.09523809523813, 163, 883, 319.0, 813.4, 876.1999999999999, 883.0, 0.12182670441360746, 20.982848268465446, 0.2695381843325057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 687.7777777777778, 81, 1226, 825.0, 1226.0, 1226.0, 1226.0, 0.05777897615654251, 46.087648600304306, 0.09950823671404543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/202341db-e41d-44fa-93e6-4f0f03aebebd", 1, 0, 0.0, 955.0, 955, 955, 955.0, 955.0, 955.0, 955.0, 1.0471204188481678, 0.33438318062827227, 0.6247954842931938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e480d4da-472d-49d6-b2cb-6d7ccd364634", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=789c5b93-560c-46f3-b377-53359ccaeb82", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f379321-f3e6-4ce1-a3cb-2057f449c52b", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1240.5652173913043, 317, 2299, 1311.0, 1836.2, 2214.5999999999985, 2299.0, 0.0936966591030378, 0.029518903300974036, 0.04227329736875338], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/70047050-039b-4402-bbb8-c8c051d7e5b3", 3, 0, 0.0, 296.3333333333333, 195, 458, 236.0, 458.0, 458.0, 458.0, 0.047783635697561444, 0.030720273601134065, 0.03064250075657423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 87.33333333333333, 79, 108, 85.0, 107.1, 108.0, 108.0, 0.09114108640174991, 0.07075894891542107, 0.032397808056872035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 247.64285714285714, 161, 481, 171.5, 481.0, 481.0, 481.0, 0.10244327203810889, 0.15876706320749884, 0.2303973198278953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 256.1333333333333, 165, 335, 321.0, 333.2, 335.0, 335.0, 0.10323326588759962, 0.15999139937853574, 0.2321740345108808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 105.14285714285714, 82, 241, 83.0, 241.0, 241.0, 241.0, 0.03388977109880321, 0.02518565996698168, 0.017011076508578953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 125.28571428571429, 77, 246, 81.0, 246.0, 246.0, 246.0, 0.03386304815809206, 0.009061010932926977, 0.019312519652661876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 104.28571428571429, 79, 241, 81.0, 241.0, 241.0, 241.0, 0.03389059148765172, 0.009134573486906128, 0.01992396101129525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 103.57142857142857, 79, 243, 80.0, 243.0, 243.0, 243.0, 0.03389042740670449, 0.009134529261963321, 0.019956960670158994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 942.9807692307694, 624, 1490, 855.5, 1299.2, 1401.6999999999994, 1490.0, 0.2239699535693058, 267.9459290230603, 0.4422531700362659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1240.5652173913043, 317, 2299, 1311.0, 1836.2, 2214.5999999999985, 2299.0, 0.08983041579765504, 0.02830085280309954, 0.04052895712745764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 157.75, 81, 238, 156.0, 238.0, 238.0, 238.0, 0.051782616575615566, 0.013957033373896383, 0.030493083784273622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 118.0, 78, 232, 81.0, 232.0, 232.0, 232.0, 0.05178194622444885, 0.013956852693308479, 0.030442120729607624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 239.83333333333334, 80, 963, 162.0, 944.1, 963.0, 963.0, 0.08846078238647533, 8.865323450093376, 0.05116058703558089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 170.83333333333331, 77, 640, 83.5, 483.40000000000026, 640.0, 640.0, 0.08866820358219543, 2.918065192065181, 0.05136713747019763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 100.27777777777776, 80, 243, 83.0, 234.9, 243.0, 243.0, 0.08883273782497976, 0.06601729832500938, 0.0445898703535543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 80.0, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.05188471216955924, 0.013883213998495344, 0.029590499909201755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 117.77777777777779, 79, 245, 82.5, 243.2, 245.0, 245.0, 0.08876483728912186, 0.038564931478477, 0.04979537855737414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 81.25, 80, 84, 80.5, 84.0, 84.0, 84.0, 0.05188336619279859, 0.03855785319601535, 0.0260430177959946], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 552.0769230769231, 239, 1071, 488.0, 925.3999999999999, 1071.0, 1071.0, 0.07719073236191765, 0.014461665152540763, 0.052535158894153694], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 87.0, 81, 98, 84.5, 98.0, 98.0, 98.0, 0.04742033383915023, 0.037324989330424885, 0.016856446794385433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1687.9545454545457, 1175, 2926, 1486.5, 2710.2999999999997, 2918.35, 2926.0, 0.09040179488654575, 0.04678999149401294, 0.04158129432769829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b868175-6428-4ca9-b5f4-b48f338d280e", 3, 0, 0.0, 719.0, 223, 1446, 488.0, 1446.0, 1446.0, 1446.0, 0.028678220803181373, 0.02876223902819069, 0.018390655918706804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 240.75, 162, 323, 239.0, 323.0, 323.0, 323.0, 0.051727705358990274, 0.08016784023898199, 0.11633682172046347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e4dc6fa-953d-4c68-aa2c-b713072cde32", 2, 0, 0.0, 663.0, 225, 1101, 663.0, 1101.0, 1101.0, 1101.0, 0.02123367661110521, 0.023970830236755496, 0.013198471838836394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45342f3c-d1dd-4cdf-a7cb-453cd74d0282", 3, 0, 0.0, 383.0, 246, 616, 287.0, 616.0, 616.0, 616.0, 0.02004088340214037, 0.02368764571392307, 0.012851738379627775], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 972.1896551724137, 423, 3061, 709.5, 1727.5000000000002, 2568.2999999999997, 3061.0, 0.27225189872229366, 90.91687867892112, 0.9877107458528525], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6650098b-07a3-42d6-89cc-138bf2c40e67", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 141.26923076923075, 78, 392, 83.5, 331.7, 335.79999999999995, 392.0, 0.22487167179114612, 0.1671165451494748, 0.10870261478185286], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 510.76923076923066, 389, 741, 471.5, 680.3000000000001, 710.1999999999999, 741.0, 0.22478224220286597, 66.09344268052824, 0.1130496628266367], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 126.67307692307692, 79, 355, 85.0, 242.5, 339.44999999999993, 355.0, 0.2249018217047558, 0.3979708016884937, 0.1093760812587582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f081c25-4d75-441d-b2b3-6f5b0ab04042", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 799.7884615384617, 540, 1177, 765.0, 1017.4, 1148.75, 1177.0, 0.22432648130972152, 201.84936220638036, 0.11260137831366882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 86.4, 82, 99, 85.0, 94.2, 99.0, 99.0, 0.10546446550608882, 0.07878937120327924, 0.03748932172286751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, 7.142857142857143, 174.23809523809527, 79, 2067, 88.0, 333.79999999999995, 456.44999999999936, 1909.6800000000005, 0.7177186799102852, 1.5302086670938801, 0.3461430631207946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 150.2857142857143, 85, 355, 92.0, 355.0, 355.0, 355.0, 0.03402236727631509, 0.026347399658318223, 0.012093888367752628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 95.66666666666667, 80, 248, 86.0, 106.60000000000001, 233.9999999999998, 248.0, 0.12036039340654303, 0.09767528019613013, 0.04278435859373209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7291ebf0-6356-4221-a29d-b2f127beb360", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9b71a0f-43a3-46fa-93bb-f253ee551eba", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 257.57142857142856, 164, 483, 171.0, 483.0, 483.0, 483.0, 0.033849293275112546, 0.05245979338633165, 0.07612785391853925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 352.55555555555554, 164, 1047, 319.0, 1024.5, 1047.0, 1047.0, 0.08842167313454832, 11.875483556024955, 0.1963486914820455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e480d4da-472d-49d6-b2cb-6d7ccd364634", 3, 0, 0.0, 383.0, 187, 543, 419.0, 543.0, 543.0, 543.0, 0.04299903968811364, 0.027252321052329827, 0.02757425396666141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3fbe032-ff92-4699-ad72-ab9301fe8aa8", 3, 0, 0.0, 380.66666666666663, 179, 707, 256.0, 707.0, 707.0, 707.0, 0.05088454297199654, 0.0327138581932595, 0.032631038299099344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 101.46153846153845, 84, 246, 89.0, 189.19999999999993, 246.0, 246.0, 0.11533513729317305, 0.09562454254092179, 0.0409980370846826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f379321-f3e6-4ce1-a3cb-2057f449c52b", 3, 0, 0.0, 342.3333333333333, 196, 463, 368.0, 463.0, 463.0, 463.0, 0.027196823411025594, 0.02727650160461258, 0.01744067126292982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1117fa3f-d082-407f-bc97-e745670ef804", 3, 0, 0.0, 257.3333333333333, 170, 422, 180.0, 422.0, 422.0, 422.0, 0.03321376378371197, 0.026996994846330988, 0.0212991909680705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 117.16666666666667, 81, 248, 91.5, 247.1, 248.0, 248.0, 0.08308178016560969, 0.06450196799966768, 0.029532976543244067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7e2373c-8ea0-40c8-bd63-c77fe23212f3", 3, 0, 0.0, 1141.0, 197, 2536, 690.0, 2536.0, 2536.0, 2536.0, 0.03963483108956151, 0.02548137740946744, 0.025416867593240938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 85.46666666666665, 80, 121, 83.0, 100.00000000000001, 121.0, 121.0, 0.10329369150994717, 0.0767641594131541, 0.05184859124620395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/789c5b93-560c-46f3-b377-53359ccaeb82", 3, 0, 0.0, 343.3333333333333, 202, 443, 385.0, 443.0, 443.0, 443.0, 0.14046916701783957, 0.063558640024348, 0.09007951140141406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 136.53333333333333, 78, 251, 82.0, 249.8, 251.0, 251.0, 0.10329582547137328, 0.027639703299957304, 0.058910900464142574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 135.5333333333333, 77, 244, 82.0, 243.4, 244.0, 244.0, 0.10329582547137328, 0.02784145295908108, 0.06072664739625656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 136.00000000000003, 79, 245, 82.0, 243.8, 245.0, 245.0, 0.10329440282062582, 0.027841069510246803, 0.060826684473473995], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.47770700636942676], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1592356687898089], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07961783439490445], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.1146496815286624], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1256, 23, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
