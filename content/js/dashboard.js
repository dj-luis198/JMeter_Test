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

    var data = {"OkPercent": 98.13953488372093, "KoPercent": 1.8604651162790697};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8177852348993289, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3508771929824561, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63c5530a-7f16-4951-9a8e-8d60b95ec2d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d4dd9bf-a224-4f0b-a219-b1f0dd32b2c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edf0f0d0-33a4-4656-bbbf-ad1dfaf1b49e"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b041bbd-a0b6-474a-9592-37b1b21adc89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b041bbd-a0b6-474a-9592-37b1b21adc89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63c5530a-7f16-4951-9a8e-8d60b95ec2d6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27b89e1b-a68c-46b7-a389-ad77494e11ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.85, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ceef7664-b504-4653-88ba-b07c66646777"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e68afd67-b411-436b-b1ad-92b1ee578667"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d812fcc8-26a9-402f-a032-4dd2af3e11b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bc59b4b-6d2f-412a-987f-8cf97bd6b0e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e68afd67-b411-436b-b1ad-92b1ee578667"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8070175438596491, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9269005847953217, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b55ac66b-26f4-4228-9ba3-43e422dfed96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95accd8d-3c67-445f-9785-c1c6925f3a51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e199c037-d133-4bd9-85df-1d30f8de89d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d812fcc8-26a9-402f-a032-4dd2af3e11b5"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ceef7664-b504-4653-88ba-b07c66646777"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27b89e1b-a68c-46b7-a389-ad77494e11ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95accd8d-3c67-445f-9785-c1c6925f3a51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61789117-e7d3-449e-aec7-28646f99f8f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/edf0f0d0-33a4-4656-bbbf-ad1dfaf1b49e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abaf1e6d-e61f-4d2d-b6ed-730577559495"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61789117-e7d3-449e-aec7-28646f99f8f9"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abaf1e6d-e61f-4d2d-b6ed-730577559495"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 24, 1.8604651162790697, 301.99302325581436, 79, 2827, 90.0, 875.8000000000002, 1057.8500000000006, 1578.3499999999906, 5.066055074694859, 717.4248470733714, 3.7189115050503463], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1373.0877192982457, 978, 1819, 1367.0, 1699.8, 1726.4999999999998, 1819.0, 0.24374494870665508, 293.30632556227044, 1.1984920085332114], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 231.52941176470588, 162, 328, 169.0, 326.4, 328.0, 328.0, 0.10377813455750834, 0.16083583939723217, 0.23339945691986497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 87.80000000000001, 83, 96, 86.0, 95.4, 96.0, 96.0, 0.09698568491290686, 0.07529650342359467, 0.03447538018388486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63c5530a-7f16-4951-9a8e-8d60b95ec2d6", 1, 0, 0.0, 1225.0, 1225, 1225, 1225.0, 1225.0, 1225.0, 1225.0, 0.8163265306122449, 0.14748086734693877, 0.5628188775510203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d4dd9bf-a224-4f0b-a219-b1f0dd32b2c8", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edf0f0d0-33a4-4656-bbbf-ad1dfaf1b49e", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 344.84999999999997, 161, 1052, 168.0, 1024.5000000000005, 1051.45, 1052.0, 0.09646550393579255, 17.438019218038566, 0.21325093872993517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b041bbd-a0b6-474a-9592-37b1b21adc89", 2, 0, 0.0, 188.0, 176, 200, 188.0, 200.0, 200.0, 200.0, 0.030407151762094443, 0.034594074026210966, 0.01890053915680968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 106.0, 82, 245, 83.0, 243.5, 245.0, 245.0, 0.0737777918306905, 0.05482900349917527, 0.03703299316501457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b041bbd-a0b6-474a-9592-37b1b21adc89", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 127.28571428571429, 80, 244, 82.5, 243.5, 244.0, 244.0, 0.07371524852569503, 0.019724587984414493, 0.04204072767481045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 139.21428571428572, 80, 244, 83.5, 243.0, 244.0, 244.0, 0.07371563666615769, 0.01986866769517531, 0.04333673171194035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 127.49999999999999, 81, 243, 83.0, 242.5, 243.0, 243.0, 0.07377895824110964, 0.019885734838424082, 0.04344600763612218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 83.0, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.028545737407761586, 0.008418762399554686, 0.01764594900304012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63c5530a-7f16-4951-9a8e-8d60b95ec2d6", 3, 0, 0.0, 336.6666666666667, 189, 458, 363.0, 458.0, 458.0, 458.0, 0.017355386244120863, 0.023925801023389277, 0.011129593392225945], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 958.5438596491229, 641, 1424, 954.0, 1363.2, 1386.6999999999998, 1424.0, 0.2550986157543535, 305.18663107034007, 0.5037201182180691], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 517.4999999999999, 84, 1211, 452.0, 1182.8000000000002, 1211.0, 1211.0, 0.08755928493250639, 0.017486204852243704, 0.05881464337832907], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 517.4999999999999, 84, 1211, 452.0, 1182.8000000000002, 1211.0, 1211.0, 0.08925848513474312, 0.017825547080131805, 0.05995601695167397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, 30.0, 1062.0, 116, 1893, 1121.0, 1854.0000000000005, 1892.0, 1893.0, 0.08840286955714582, 0.027729493849370353, 0.039884888413477905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27b89e1b-a68c-46b7-a389-ad77494e11ac", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 146.125, 79, 320, 82.0, 265.40000000000003, 320.0, 320.0, 0.08165473316764227, 0.02184902039837303, 0.04656871500967098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 83.8, 82, 87, 83.0, 87.0, 87.0, 87.0, 0.023532955550953555, 0.006342866925842951, 0.013857785348852535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 92.93750000000001, 81, 245, 83.0, 132.30000000000013, 245.0, 245.0, 0.08172062781872322, 0.060731833759812864, 0.04101992451057006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 81.4, 81, 82, 81.0, 82.0, 82.0, 82.0, 0.023533287835643516, 0.006342956486950792, 0.013834999294001366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 121.4375, 79, 243, 82.0, 241.6, 243.0, 243.0, 0.08172229741808616, 0.02202671297596854, 0.048123579436626915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 117.6875, 80, 329, 81.5, 268.80000000000007, 329.0, 329.0, 0.08161849475091056, 0.02199873491333136, 0.04798274789067203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 125.06666666666668, 80, 245, 83.0, 243.8, 245.0, 245.0, 0.0893075095707881, 0.024071164689001483, 0.0525030476187641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 113.60000000000001, 79, 243, 82.0, 242.4, 243.0, 243.0, 0.0893075095707881, 0.024071164689001483, 0.05259026198357933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 81.8, 81, 82, 82.0, 82.0, 82.0, 82.0, 0.023533177073037568, 0.00629696339649638, 0.013421265049466738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 82.93333333333334, 81, 86, 83.0, 84.8, 86.0, 86.0, 0.08930697785186949, 0.06636973646999285, 0.044827916617051676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 83.4, 83, 85, 83.0, 85.0, 85.0, 85.0, 0.023532955550953555, 0.01748884684987857, 0.011812440579287235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 92.13333333333334, 79, 242, 81.0, 147.80000000000007, 242.0, 242.0, 0.08930644613928233, 0.023896451408362655, 0.050932582563809455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 86.4, 82, 95, 85.0, 95.0, 95.0, 95.0, 0.0234585393775042, 0.01846443626784022, 0.008338777669347196], "isController": false}, {"data": ["deleteAccount", 10, 1, 10.0, 451.90000000000003, 83, 841, 446.0, 804.1000000000001, 841.0, 841.0, 0.10043185698503566, 0.01901732135683439, 0.06835054798131968], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1639.0500000000002, 1007, 2827, 1416.0, 2530.8000000000006, 2813.5, 2827.0, 0.08891931905585468, 0.04602269443320603, 0.04089941335479253], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 197.75, 81, 365, 193.0, 332.0000000000001, 365.0, 365.0, 0.08744889705078594, 0.1964468875480058, 0.05652011233539567], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 168.0, 166, 171, 167.0, 171.0, 171.0, 171.0, 0.02352365538785803, 0.03645707138723701, 0.05290525230296587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ceef7664-b504-4653-88ba-b07c66646777", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e68afd67-b411-436b-b1ad-92b1ee578667", 3, 0, 0.0, 530.0, 200, 956, 434.0, 956.0, 956.0, 956.0, 0.03436859168967453, 0.02865168076733609, 0.022039754436412377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 82.41176470588235, 80, 85, 82.0, 84.2, 85.0, 85.0, 0.10383010951022727, 0.07716280599344037, 0.05211784793775079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 595.0, 477, 691, 638.0, 691.0, 691.0, 691.0, 0.028909950323068697, 8.500485295676517, 0.016487706043625115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 81.35294117647061, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.10383137784238397, 0.027783005399231647, 0.059216332675734604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 847.1666666666667, 717, 1120, 790.0, 1120.0, 1120.0, 1120.0, 0.028853922209825723, 25.96280992418632, 0.0164275748518832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 190.16666666666669, 83, 250, 241.5, 250.0, 250.0, 250.0, 0.028942722352464475, 0.051215051662759394, 0.01602590192758531], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 840.0526315789479, 420, 1920, 701.0, 1502.4000000000003, 1761.9999999999993, 1920.0, 0.2846513021548603, 78.74430482814802, 1.0370011579565033], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d812fcc8-26a9-402f-a032-4dd2af3e11b5", 3, 0, 0.0, 341.6666666666667, 188, 472, 365.0, 472.0, 472.0, 472.0, 0.028219358479917224, 0.0235253180556862, 0.018096398504374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bc59b4b-6d2f-412a-987f-8cf97bd6b0e5", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 96.58333333333334, 81, 245, 83.0, 197.00000000000017, 245.0, 245.0, 0.09097387533546616, 0.06760851477567359, 0.04566462101799766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 95.08333333333333, 79, 243, 82.0, 195.60000000000016, 243.0, 243.0, 0.09097663416779124, 0.0357302438552865, 0.05124839369380298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 161.0, 80, 876, 82.0, 684.9000000000007, 876.0, 876.0, 0.09097525473071325, 6.844118461627396, 0.05283198386705483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e68afd67-b411-436b-b1ad-92b1ee578667", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 143.80701754385964, 81, 353, 83.0, 330.0, 334.0, 353.0, 0.25592672413793105, 0.19019554401266164, 0.12371457856276939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 128.25, 81, 638, 81.0, 472.1000000000006, 638.0, 638.0, 0.09097594444402327, 2.2516398177069514, 0.05292122809943671], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 522.561403508772, 396, 929, 480.0, 649.0, 732.2, 929.0, 0.25579694210462545, 75.2127942366032, 0.12864787615613488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 110.0, 82, 248, 82.0, 248.0, 248.0, 248.0, 0.028964658289443827, 0.021525493123307378, 0.01626433448870137], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 112.35087719298244, 80, 348, 83.0, 243.0, 256.79999999999956, 348.0, 0.25625233212100507, 0.4534465095734972, 0.12462271620728566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 569.3333333333331, 80, 999, 755.0, 970.2, 999.0, 999.0, 0.06905950166663596, 37.291362073500025, 0.03703855304230125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 110.35294117647061, 80, 246, 82.0, 242.0, 246.0, 246.0, 0.10383137784238397, 0.027985801059080054, 0.06104149361437026], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 811.6491228070176, 556, 1173, 799.0, 1044.4, 1055.1999999999998, 1173.0, 0.25552058958013935, 229.9178756614957, 0.12825935844159336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 84.45, 81, 93, 84.0, 87.80000000000001, 92.75, 93.0, 0.09604118245903843, 0.07174951619254337, 0.03413963907723632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 432.8666666666667, 82, 717, 485.0, 678.0, 717.0, 717.0, 0.06900835001035126, 12.181887680284314, 0.0370785099372024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 119.17647058823529, 80, 242, 82.0, 241.2, 242.0, 242.0, 0.10383074367243232, 0.027985630130460275, 0.06114251800241864], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 458.58333333333337, 82, 1225, 427.5, 1037.2000000000007, 1225.0, 1225.0, 0.08949813918452278, 0.017873407678940342, 0.060641398669461], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 11, 6.432748538011696, 138.24561403508784, 81, 1531, 87.0, 231.0, 274.00000000000006, 897.400000000001, 0.742020030201517, 1.5949464259368547, 0.354885961881433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 87.28571428571428, 83, 109, 85.0, 99.5, 109.0, 109.0, 0.07363382948508915, 0.05702307302898017, 0.026174525324777785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 258.91666666666663, 164, 1122, 166.0, 882.9000000000009, 1122.0, 1122.0, 0.09091735612328393, 9.193225958515168, 0.20253675997060339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b55ac66b-26f4-4228-9ba3-43e422dfed96", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 86.3125, 82, 96, 85.0, 93.2, 96.0, 96.0, 0.08304268393954493, 0.06739108432984554, 0.02951907905663511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95accd8d-3c67-445f-9785-c1c6925f3a51", 3, 0, 0.0, 293.0, 187, 470, 222.0, 470.0, 470.0, 470.0, 0.028002314858028263, 0.023344377718558067, 0.017957213629660053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e199c037-d133-4bd9-85df-1d30f8de89d7", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d812fcc8-26a9-402f-a032-4dd2af3e11b5", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 651.85, 99, 1733, 463.0, 1241.9, 1708.6999999999996, 1733.0, 0.09010876127485876, 0.05535001058777945, 0.04074253561548789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 99.8, 82, 336, 83.0, 186.60000000000008, 336.0, 336.0, 0.06905854783685608, 0.05132183096078856, 0.0346641538946719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 145.93333333333334, 80, 245, 82.0, 244.4, 245.0, 245.0, 0.06905886577718848, 0.08071254937708904, 0.035905214980249164], "isController": false}, {"data": ["login", 20, 0, 0.0, 2782.4, 1652, 4060, 2784.0, 3971.400000000001, 4057.6, 4060.0, 0.08776125428384622, 31.61684032881948, 0.17607101640696649], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 269.49999999999994, 165, 489, 246.5, 487.5, 489.0, 489.0, 0.07368304710978248, 0.11419433180002422, 0.16571489989631744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 112.70588235294117, 82, 249, 85.0, 244.2, 249.0, 249.0, 0.09992241318505632, 0.08089421926798016, 0.03551929531187548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ceef7664-b504-4653-88ba-b07c66646777", 3, 0, 0.0, 394.6666666666667, 255, 499, 430.0, 499.0, 499.0, 499.0, 0.017826159294559454, 0.024574799678534927, 0.011431488870534547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 240.66666666666669, 165, 331, 169.0, 328.6, 331.0, 331.0, 0.08926233605484278, 0.13833918683499558, 0.20075308587334267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27b89e1b-a68c-46b7-a389-ad77494e11ac", 3, 0, 0.0, 287.6666666666667, 194, 434, 235.0, 434.0, 434.0, 434.0, 0.03028712191576142, 0.030375853718249, 0.019422405655615232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95accd8d-3c67-445f-9785-c1c6925f3a51", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 125.33333333333333, 82, 247, 85.5, 247.0, 247.0, 247.0, 0.09409550693954363, 0.07801473182780522, 0.033448012232415905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 691.6666666666667, 165, 1082, 837.0, 1053.8, 1082.0, 1082.0, 0.0689816922588745, 49.558414774843754, 0.14455167504794228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61789117-e7d3-449e-aec7-28646f99f8f9", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 96.86666666666667, 83, 246, 84.0, 158.40000000000003, 246.0, 246.0, 0.06927222599371008, 0.053780683266601084, 0.02462411158370163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edf0f0d0-33a4-4656-bbbf-ad1dfaf1b49e", 3, 0, 0.0, 301.0, 198, 472, 233.0, 472.0, 472.0, 472.0, 0.020022291484519433, 0.023665670696709003, 0.012839815828288829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abaf1e6d-e61f-4d2d-b6ed-730577559495", 3, 0, 0.0, 419.66666666666663, 199, 841, 219.0, 841.0, 841.0, 841.0, 0.03152618249456174, 0.02628208117466556, 0.020216985518973506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61789117-e7d3-449e-aec7-28646f99f8f9", 3, 0, 0.0, 266.0, 181, 425, 192.0, 425.0, 425.0, 425.0, 0.017425448124440933, 0.024022386981447704, 0.011174522397509322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 276.25, 164, 575, 323.5, 456.0000000000001, 575.0, 575.0, 0.0815831204523784, 0.12643790249797318, 0.18348235000178464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 665.8888888888889, 81, 1206, 872.0, 1206.0, 1206.0, 1206.0, 0.043262990914771905, 34.508910598831896, 0.07450848435321829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abaf1e6d-e61f-4d2d-b6ed-730577559495", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 90.55, 80, 243, 82.0, 89.4, 235.34999999999988, 243.0, 0.09650367196471825, 0.07171806090346737, 0.048440319716665216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 135.3, 80, 350, 81.5, 254.70000000000002, 345.29999999999995, 350.0, 0.09650460326957595, 0.04756432936538573, 0.05382204973364729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 245.3, 80, 962, 83.5, 941.6000000000004, 961.8, 962.0, 0.09650506892874548, 13.047424061065996, 0.05549041463402865], "isController": false}, {"data": ["register", 20, 6, 30.0, 1062.0, 116, 1893, 1121.0, 1854.0000000000005, 1892.0, 1893.0, 0.08925224469395406, 0.027995918941111368, 0.040268102586530054], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 185.80000000000004, 79, 734, 82.5, 477.9, 721.1999999999998, 734.0, 0.09650460326957595, 4.278442997746618, 0.055584389656636625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 25.0, 0.46511627906976744], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15503875968992248], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.07751937984496124], "isController": false}, {"data": ["401/Unauthorized", 15, 62.5, 1.1627906976744187], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 24, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
